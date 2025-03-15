

import 'typescript-generic-types' // imported here because this file is required independently in a build context
import path from 'path'
import fs from 'fs-extra'
import { C, urlPathJoin, kebabCase, camelCaseToWords, perfTimer } from 'topkat-utils'

import { ServiceClean, RouteFromSevicesConfigForGenerateSdk } from '../types/core.types'
import generateAllRouteFile from './generateAllRoutesFile'
import { generateSDKconfigForServices } from './generateSDK/generateSDKconfigForServices'
import { getDaoRouteDescriptionFromDaoConfigs } from './helpers/getDaoRouteDescriptionFromDaoConfigs'
import { getAllTargetRolesForService } from './helpers/getAllTargetRolesForService'
import { parseForClause } from '../security/helpers/parseForClause'
import { generateSwaggerDoc } from './generateSwaggerDoc'
import { getActiveAppConfig, getMainConfig } from '../helpers/getGreenDotConfigs'
import { createDaoRouteConfigPerPlatformForSdk, createServiceRouteConfigPerPlatformForSdk } from './generateSDK/generateSDKgetRouteConfigs'

export async function generateMainBackendFiles() {

    const time = perfTimer()

    const allRoutes: string[] = []
    const serviceRouteConfig = {} as RouteFromSevicesConfigForGenerateSdk

    const { allDaoRoutes } = await getDaoRouteDescriptionFromDaoConfigs()
    allRoutes.push(...Object.values(allDaoRoutes).flat())

    const mainConfig = await getMainConfig()
    const appConfig = await getActiveAppConfig()

    //----------------------------------------
    // SERVICES API
    //----------------------------------------

    let generatedServicePath = path.join(path.resolve(process.cwd(), `./src/2_generated`), 'services.generated')
    if (!await fs.exists(generatedServicePath + '.ts')) {
        generatedServicePath = path.join(path.resolve(process.cwd(), 'apps/backend/dist', `./2_generated`), 'services.generated')
        if (!await fs.exists(generatedServicePath + '.ts')) {
            // We probably are in a server where we don't care about generating files
            return C.warning(false, `Generating files for SDK and tests will not run because path doesn't exist: ${generatedServicePath}`)
        }
    }

    const { default: servicesGenerated } = await import(generatedServicePath)

    for (const svc of Object.values(appConfig.additionalServices)) {
        svc._isSharedService = true
    }

    const allServices = { ...servicesGenerated, ...(appConfig.additionalServices || {}) }

    for (const services of Object.values(allServices)) {
        if (services && typeof services === 'object' && Object.keys(services)) {
            for (const [serviceName, service] of (Object.entries(services) as [string, ServiceClean][])) {
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
        }
    }

    const serviceRouteObject = await createServiceRouteConfigPerPlatformForSdk(serviceRouteConfig)
    const daoRoutesObject = await createDaoRouteConfigPerPlatformForSdk()

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

    //----------------------------------------
    // GENERATE SWAGGER DOC
    //----------------------------------------
    await generateSwaggerDoc(daoRoutesObject, serviceRouteObject)
    C.log(C.primary(`✓ Swagger doc generated`))

    C.log(C.dim('-> Generated in: ' + time.end()))
}