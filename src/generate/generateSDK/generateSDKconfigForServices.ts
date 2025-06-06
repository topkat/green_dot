

import { GenerateSDKparamsForService } from '../../types/core.types.js'
import { RouteConfigPerPlatforms } from './generateSDKgetRouteConfigs.js'
import { SDKuseQueryGenerator } from './generators/SDKuseQuery.generator.js'
import { SDKprefetchGenerator } from './generators/SDKprefetch.generator.js'
import { SDKdeferGenerator } from './generators/SDKdefer.generator.js'
import { env, getTsTypeAsStringAndRouteClean } from './generateSDKconfigShared.js'
import { getMainConfig } from '../../helpers/getGreenDotConfigs.js'


//  ╔═══ ╔══╗ ╔══╗ ╦  ╦ ═╦═ ╔══╗ ╔══╗ ╔═══
//  ╚══╗ ╠═   ╠═╦╝ ╚╗ ║  ║  ║    ╠═   ╚══╗
//  ═══╝ ╚══╝ ╩ ╚   ╚═╝ ═╩═ ╚══╝ ╚══╝ ═══╝
/** This will generate files with route description for the SDK to generate routes */
export async function generateSDKconfigForServices(
    routeConfig: RouteConfigPerPlatforms
) {

    if (env === 'production' || env === 'preprod') return

    const mainConfig = getMainConfig()

    const { generateSdkConfig, platforms } = mainConfig

    const sdkParams = {} as GenerateSDKparamsForService


    for (const platform of platforms) {
        sdkParams[platform] ??= {
            serviceMethods: [],
            sharedServiceMethods: [],
            methodConfigService: {},
            objectTs: {},
            queriesToInvalidate: {},
        }

        const objectTs = {}

        sdkParams[platform].objectTs = objectTs

        //----------------------------------------
        // GENERATE API SERVICE FILES AND TYPES
        //----------------------------------------

        for (const [originalApiAddr, { tsType, doc, isShared, outputValidator, queriesToInvalidate }] of routeConfig[platform]) {

            const queryName = generateSdkConfig.processAddrInSdk(originalApiAddr)

            if (typeof objectTs[queryName] !== 'undefined') continue

            if (isShared) sdkParams[platform].sharedServiceMethods.push(queryName)
            else sdkParams[platform].serviceMethods.push(queryName)

            const { routeClean, tsTypesAsString } = getTsTypeAsStringAndRouteClean(queryName, originalApiAddr, objectTs, tsType, outputValidator, doc)
            if (queryName === null) continue

            sdkParams[platform].queriesToInvalidate[queryName] = queriesToInvalidate

            sdkParams[platform].methodConfigService ??= {}
            sdkParams[platform].methodConfigService[queryName] = routeClean

            // expose via react query only read methods or services
            SDKuseQueryGenerator(queryName, tsTypesAsString, objectTs)
            SDKprefetchGenerator(queryName, tsTypesAsString, objectTs)
            SDKdeferGenerator(queryName, tsTypesAsString, objectTs)

            //----------------------------------------
            // ADD SIDE EFFECT (USE MUTATION AUTOMATICALLY) on services write requests
            //----------------------------------------
            objectTs['addQueriesToInvalidate.' + queryName] = `(queriesToInvalidate: Array<\`\${ModelNames}*\` | MethodNames>):void`


        } //</for routeConfig>

    } // </for (const platform of platforms)>

    return sdkParams
}