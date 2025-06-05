

import 'typescript-generic-types' // imported here because this file is required independently in a build context
import { C, urlPathJoin, kebabCase, camelCaseToWords, perfTimer } from 'topkat-utils'

import { GenerateSDKparamsForService, GreenDotAppConfig, RouteFromSevicesConfigForGenerateSdk } from '../types/core.types'
import generateAllRouteFile from './generateAllRoutesFile'
import { generateSDKconfigForServices } from './generateSDK/generateSDKconfigForServices'
import { getDaoRouteDescriptionFromDaoConfigs } from './helpers/getDaoRouteDescriptionFromDaoConfigs'
import { getAllTargetRolesForService } from './helpers/getAllTargetRolesForService'
import { parseForClause } from '../security/helpers/parseForClause'
import { generateSwaggerDoc } from './generateSwaggerDoc'
import { getMainConfig } from '../helpers/getGreenDotConfigs'
import { createDaoRouteConfigPerPlatformForSdk, createServiceRouteConfigPerPlatformForSdk } from './generateSDK/generateSDKgetRouteConfigs'
import { getActiveAppServices } from '../helpers/getProjectServices'
import { initProjectAndDaosCache } from '../helpers/getProjectModelsAndDaos'
import { GDpathConfig } from '../helpers/getProjectPaths'

export async function generateMainBackendFiles(
    appConfig: GreenDotAppConfig & GDpathConfig & {
        generatedIndexPath: string;
        generatedFolderPath: string;
        folderPathRelative: string;
    },
    { generateSdk = true, doGenerateSwaggerDoc = true } = {}
) {

    const time = perfTimer()

    const allRoutes: string[] = []
    const serviceRouteConfig = {} as RouteFromSevicesConfigForGenerateSdk

    const { allDaoRoutes } = await getDaoRouteDescriptionFromDaoConfigs()
    allRoutes.push(...allDaoRoutes)

    const mainConfig = getMainConfig()
    const allServicesFromApp = await getActiveAppServices(appConfig)

    //----------------------------------------
    // SERVICES API
    //----------------------------------------

    for (const svc of Object.values(appConfig?.additionalServices || {})) {
        svc._isSharedService = true
    }

    const allServices = { ...allServicesFromApp, ...(appConfig?.additionalServices || {}) }

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



    if (doGenerateSwaggerDoc) { // TODO naming is not relevant here
        //----------------------------------------
        // GENERATE ALL ROUTES FILE for tests
        //----------------------------------------
        await generateAllRouteFile(allRoutes)
        C.log(C.primary(`✓ All route files generated`))

        //----------------------------------------
        // GENERATE SWAGGER DOC
        //----------------------------------------
        await generateSwaggerDoc(daoRoutesObject, serviceRouteObject)
        C.log(C.primary(`✓ Swagger doc generated`) + C.dim('-> ' + time.end()))
    }

    let sdkParams: GenerateSDKparamsForService = {}
    if (generateSdk) {

        //----------------------------------------
        // GENERATE SDK CONFIG FILES
        //----------------------------------------
        sdkParams = await generateSDKconfigForServices(serviceRouteObject)

        C.log(C.primary(`✓ SDK files generated`))
    }

    return sdkParams
}