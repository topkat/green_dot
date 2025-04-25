

import 'typescript-generic-types' // imported here because this file is required independently in a build context
import { C, urlPathJoin, kebabCase, camelCaseToWords, perfTimer } from 'topkat-utils'

import { RouteFromSevicesConfigForGenerateSdk } from '../types/core.types'
import generateAllRouteFile from './generateAllRoutesFile'
import { generateSDKconfigForServices } from './generateSDK/generateSDKconfigForServices'
import { getDaoRouteDescriptionFromDaoConfigs } from './helpers/getDaoRouteDescriptionFromDaoConfigs'
import { getAllTargetRolesForService } from './helpers/getAllTargetRolesForService'
import { parseForClause } from '../security/helpers/parseForClause'
import { generateSwaggerDoc } from './generateSwaggerDoc'
import { getActiveAppConfig, getMainConfig } from '../helpers/getGreenDotConfigs'
import { createDaoRouteConfigPerPlatformForSdk, createServiceRouteConfigPerPlatformForSdk } from './generateSDK/generateSDKgetRouteConfigs'
import { getActiveAppServices } from '../helpers/getProjectServices'
import { initProjectAndDaosCache } from '../helpers/getProjectModelsAndDaos'

export async function generateMainBackendFiles({ generateSdk = true, doGenerateSwaggerDoc = true } = {}) {

    const time = perfTimer()

    const allRoutes: string[] = []
    const serviceRouteConfig = {} as RouteFromSevicesConfigForGenerateSdk

    const { allDaoRoutes } = await getDaoRouteDescriptionFromDaoConfigs()
    allRoutes.push(...Object.values(allDaoRoutes).flat())

    const mainConfig = getMainConfig()
    const appConfig = await getActiveAppConfig()
    const allServicesFromApp = await getActiveAppServices()

    //----------------------------------------
    // SERVICES API
    //----------------------------------------

    for (const svc of Object.values(appConfig.additionalServices)) {
        svc._isSharedService = true
    }

    const allServices = { ...allServicesFromApp, ...(appConfig.additionalServices || {}) }

    for (const [serviceName, service] of Object.entries(allServices)) {
        if (typeof service.main === 'function' && ('route' in service || ('on' in service !== true && 'schedule' in service !== true))) {
            const realRoute = service?.route ? Array.isArray(service?.route) ? service?.route[1] : service?.route : kebabCase(camelCaseToWords(serviceName))
            const rte = '/' + urlPathJoin(realRoute)
            if (service.maskInSdk !== true) allRoutes.push(rte)
            const allRoles = getAllTargetRolesForService(mainConfig.allRoles, service.for)
            for (const role of allRoles) {
                const platform = mainConfig.generateSdkConfig.sdkNameForRole[role] || 'main'
                serviceRouteConfig[platform] ??= {}
                const forParsed = await parseForClause(service.for || [])
                serviceRouteConfig[platform][realRoute] = {
                    ...service,
                    serviceName,
                    isPublic: forParsed.some(perm => perm.role === 'public') || false,
                    for: forParsed

                }
            }
        }
    }
    await initProjectAndDaosCache()
    const serviceRouteObject = await createServiceRouteConfigPerPlatformForSdk(serviceRouteConfig)
    const daoRoutesObject = await createDaoRouteConfigPerPlatformForSdk()


    //----------------------------------------
    // GENERATE SWAGGER DOC
    //----------------------------------------
    if (doGenerateSwaggerDoc) {
        await generateSwaggerDoc(daoRoutesObject, serviceRouteObject)
        C.log(C.primary(`✓ Swagger doc generated`) + C.dim('-> ' + time.end()))
    }

    if (generateSdk) {
        //----------------------------------------
        // GENERATE ALL ROUTES FILE for tests
        //----------------------------------------
        await generateAllRouteFile(allRoutes)
        C.log(C.primary(`✓ All route files generated`))

        //----------------------------------------
        // GENERATE SDK CONFIG FILES
        //----------------------------------------
        await generateSDKconfigForServices(serviceRouteObject)

        C.log(C.primary(`✓ SDK files generated`))
    }
}