

import { GenerateSDKparamsForDao, DbReadWriteStr } from '../../types/core.types.js'
import { mongoDaoREADMethodsFull } from '../../databases/mongo/types/mongoDaoTypes.js'
import { SDKuseQueryGenerator } from './generators/SDKuseQuery.generator.js'
import { SDKprefetchGenerator } from './generators/SDKprefetch.generator.js'
import { SDKdeferGenerator } from './generators/SDKdefer.generator.js'
import { env, getTsTypeAsStringAndRouteClean } from './generateSDKconfigShared.js'
import { RouteConfigPerPlatforms } from './generateSDKgetRouteConfigs.js'
import { getMainConfig } from '../../helpers/getGreenDotConfigs.js'



export async function generateSDKconfigForDaos(routeConfig: RouteConfigPerPlatforms) {

    if (env === 'production' || env === 'preprod') return

    const mainConfig = getMainConfig()
    const { generateSdkConfig, platforms } = mainConfig

    const sdkParams = {} as GenerateSDKparamsForDao

    for (const platform of platforms) {

        const objectTs = {
            dao__COMMENT__: `// DAO ${'='.repeat(35)}`
        }

        sdkParams[platform] ??= {
            allMethodNames: [],
            methodConfigAll: { dbRead: {}, dbWrite: {} },
            objectTs,
        }

        //----------------------------------------
        // GENERATE DAO FILES AND TYPES
        //----------------------------------------
        for (const [originalApiAddr, { doc, tsType, outputValidator }] of routeConfig[platform]) {

            const queryName = generateSdkConfig.processAddrInSdk(originalApiAddr.replace(/[^.]*\./, ''))

            if (typeof objectTs[queryName] !== 'undefined') continue // may be defined twice when using processAddrInSdk()

            sdkParams[platform].allMethodNames.push(queryName)

            const { routeClean, tsTypesAsString } = getTsTypeAsStringAndRouteClean(queryName, originalApiAddr, objectTs, tsType, outputValidator, doc)
            if (queryName === null) continue

            const lowerCaseApiAddr = queryName.toLowerCase()

            const isRead = mongoDaoREADMethodsFull.some(readStr => lowerCaseApiAddr.endsWith(readStr.toLowerCase()))

            const methKey: DbReadWriteStr = isRead ? 'dbRead' : 'dbWrite'
            sdkParams[platform].methodConfigAll[methKey] ??= {}
            sdkParams[platform].methodConfigAll[methKey][queryName] = routeClean

            // expose via react query only read methods or services
            if (isRead) {
                SDKuseQueryGenerator(queryName, tsTypesAsString, objectTs)
                SDKprefetchGenerator(queryName, tsTypesAsString, objectTs)
            } else SDKdeferGenerator(queryName, tsTypesAsString, objectTs)

        } //</for routeConfig>

    } // </for (const platform of platforms)>

    return sdkParams
}