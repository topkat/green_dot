

import 'typescript-generic-types' // imported here because this file is required independently in a build context
import path from 'path'
import fs from 'fs-extra'
import { C, urlPathJoin, kebabCase, camelCaseToWords, objEntries } from 'topkat-utils'

import { ServiceClean, RouteFromSevicesConfigForGenerateSdk } from '../types/core.types'
import generateAllRouteFile from './generateAllRoutesFile'
import { generateSDKconfigForServices } from './generateSDK/generateSDKconfigForServices'
import { getDaoRouteDescriptionFromDaoConfigs } from './helpers/getDaoRouteDescriptionFromDaoConfigs'
import { getAllTargetRolesForService } from './helpers/getAllTargetRolesForService'
import { MongoDaoParsed } from '../databases/mongo/types/mongoDbTypes'
import { parseForClause } from '../security/helpers/parseForClause'
import { generateSwaggerDoc } from './generateSDK/generateSwaggerDoc'
import { createDaoRouteConfigPerPlatformForSdk, createServiceRouteConfigPerPlatformForSdk } from './generateSDK/generateSDKgetRouteConfigs'
import { registerModels } from '../registerModules/registerModels'

export { greenDotConfig, updateGreenDotConfig } from '../cache/green_dot.app.config.cache' // this file may be used on its own

export async function generateMainBackendFiles() {

    const dbConfigs = await serverConfig.dbConfigs()

    const allRoutes: string[] = []
    const serviceRouteConfig = {} as RouteFromSevicesConfigForGenerateSdk

    await registerModels()

    //----------------------------------------
    // DAO API
    //----------------------------------------

    const daoConf = {} as Record<string, Record<string, MongoDaoParsed<any>>>
    for (const dbConf of Object.values(dbConfigs)) { // TODO not compatible with multiple DB adresses actually, should say if default
        for (const [dbId, dbConf2] of objEntries(dbConf)) {
            daoConf[dbId] = dbConf2.daoConfigsParsed
        }
    }

    const { allDaoRoutes } = await getDaoRouteDescriptionFromDaoConfigs()
    allRoutes.push(...Object.values(allDaoRoutes).flat())

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

    for (const svc of Object.values(serverConfig.additionalServices)) {
        svc._isSharedService = true
    }

    const allServices = { ...servicesGenerated, ...(serverConfig.additionalServices || {}) }

    for (const services of Object.values(allServices)) {
        if (services && typeof services === 'object' && Object.keys(services)) {
            for (const [serviceName, service] of (Object.entries(services) as [string, ServiceClean][])) {
                if (typeof service.main === 'function' && ('route' in service || ('on' in service !== true && 'schedule' in service !== true))) {
                    const realRoute = service?.route ? Array.isArray(service?.route) ? service?.route[1] : service?.route : kebabCase(camelCaseToWords(serviceName))
                    const rte = '/' + urlPathJoin(realRoute)
                    if (service.maskInSdk !== true) allRoutes.push(rte)
                    const allRoles = getAllTargetRolesForService(serverConfig.connexion.allRoles, service.for)
                    for (const role of allRoles) {
                        const platform = serverConfig.connexion.sdkNameForRole[role]
                        serviceRouteConfig[platform] ??= {}
                        const forParsed = parseForClause(service.for || [])
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
}