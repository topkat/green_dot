
import fs from 'fs-extra'
import path from 'path'
import { MainTypes, Definition } from 'good-cop'
import { capitalize1st, includes } from 'topkat-utils'

import { daoValidators } from '../../databases/mongo/types/mongoDaoTypes'
import { error } from '../../core.error'
import { RouteFromSevicesConfigForGenerateSdk, AllPossibleDaoMethods, DbType, ApiMethod, ServiceDocObject } from '../../types/core.types'
import { _ } from '../../definitions'
import { getDaoRouteDescriptionFromDaoConfigs } from '../helpers/getDaoRouteDescriptionFromDaoConfigs'
import { generateSdkConfigDefault } from './generateSDKconfigShared'
import { serverConfig } from '../../cache/green_dot.app.config.cache'

export type RouteConfig = {
    queryName: string,
    route: string,
    inputValidator: Definition | Definition[],
    outputValidator: Definition,
    tsType: string[], // may accept multiple types for the same input (check typescript overloading)
    isDao: boolean,
    platform: string
    queriesToInvalidate: string[]
    doc?: ServiceDocObject,
    isShared?: boolean,
    method?: ApiMethod
}

export type RouteConfigPerPlatforms = {
    [platform: string]: [ // /!\ array allow to be sorted
        queryName: string,
        config: RouteConfig
    ][]
}


//  ╔═══ ╔══╗ ╔══╗ ╦  ╦ ═╦═ ╔══╗ ╔══╗
//  ╚══╗ ╠═   ╠═╦╝ ╚╗ ║  ║  ║    ╠═
//  ═══╝ ╚══╝ ╩ ╚   ╚═╝ ═╩═ ╚══╝ ╚══╝
export function createServiceRouteConfigPerPlatformForSdk(
    sdkConfig: RouteFromSevicesConfigForGenerateSdk,
) {
    const routeDescriptionSorted: RouteConfigPerPlatforms = {}

    const generateSdkConfig = { ...generateSdkConfigDefault, ...(serverConfig.generateSdkConfig || {}) }

    for (const platform in sdkConfig) {

        routeDescriptionSorted[platform] ??= []

        for (const [route, routeConfig] of Object.entries(sdkConfig[platform])) {
            if (!generateSdkConfig.shallExposeRoute(route)) continue

            if (routeConfig.maskInSdk === true) continue

            const { input } = routeConfig
            let { output } = routeConfig

            // INPUT TYPE
            const inputTypeStr = input.map((v: Definition, i) => {
                return ' ' + (v.getName() || `param${i}`) + '?: ' + v.getTsTypeAsString().read
            }).join(', ')


            // OUTPUT TYPE
            let outputTypeStr = 'Promise<void>'

            if (output) {
                const mainReturnType = output.getMainType()
                const flatTypes = ['boolean', 'date', 'number', 'string'] satisfies MainTypes[]

                if (mainReturnType === 'object') output = output.complete() as any as Definition
                else if (includes(flatTypes, mainReturnType)) output = output.required() as any as Definition

                outputTypeStr = output.promise().getTsTypeAsString().read
            }


            const queryName = routeToObjAddr(route)
            routeDescriptionSorted[platform].push([
                queryName,
                {
                    queryName,
                    inputValidator: routeConfig.input,
                    outputValidator: routeConfig.output,
                    route,
                    tsType: [`(${inputTypeStr}): ${outputTypeStr}`],
                    doc: routeConfig.doc,
                    isShared: routeConfig._isSharedService,
                    isDao: false,
                    platform,
                    method: routeConfig.method,
                    queriesToInvalidate: routeConfig.invalidateCacheFor,
                }
            ]) // .push(                [routeToObjAddr(route), { ts: [`(${inputTypeStr}): ${outputTypeStr}`], doc, isShared: _isSharedService }]            )
        }

        sortRoutes(routeDescriptionSorted[platform])

    }
    return routeDescriptionSorted
}

//  ╔═╗  ╔══╗ ╔══╗
//  ║  ║ ╠══╣ ║  ║
//  ╚══╝ ╩  ╩ ╚══╝
export async function createDaoRouteConfigPerPlatformForSdk() {

    const { daoRoutesConfig } = await getDaoRouteDescriptionFromDaoConfigs()

    const routeDescriptionSorted: RouteConfigPerPlatforms = {}

    for (const platform in daoRoutesConfig) {
        routeDescriptionSorted[platform] ??= []

        for (const [route, routeConfig] of Object.entries(daoRoutesConfig[platform])) {
            if (!generateSdkConfigDefault.shallExposeRoute(route)) continue

            const { modelName, daoMethod, dbType, dbId } = routeConfig
            const tsTypeStrArr = await getTsTypingsFromDaoTypeTemplate(dbType, daoMethod)
            const tsType = tsTypeStrArr.map(str => (
                str.replace(/ModelTypes/g, `modelTypes.${capitalize1st(modelName)}Models`)
            ))

            const { doc, paramsValidator, method, output } = daoValidators[daoMethod]

            const isWrite = method === 'create' || method === 'update'

            const queryName = routeToObjAddr(route)

            routeDescriptionSorted[platform].push([
                queryName,
                {
                    route,
                    queryName,
                    inputValidator: paramsValidator as any as Definition,
                    outputValidator: typeof output === 'function' ? output(_.model(dbId, modelName, isWrite ? 'Write' : 'Read')) : (output || _.void() as any as Definition),
                    doc,
                    isShared: false,
                    tsType,
                    isDao: true,
                    platform,
                    queriesToInvalidate: [],
                }
            ])
        }

        sortRoutes(routeDescriptionSorted[platform])

    }
    return routeDescriptionSorted
}



//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝
const tsForMethod: { [dbType: string]: { [fnName: string]: string[] } } = {} as any // cache for perf

async function getTsTypingsFromDaoTypeTemplate(dbType: DbType, fnName: AllPossibleDaoMethods) {
    if (!tsForMethod[dbType]) tsForMethod[dbType] = {}
    if (Object.keys(tsForMethod[dbType]).length === 0) {

        const typeFileUrl = path.resolve(__dirname, `../../databases/mongo/types/mongoDaoTypes.ts`).replace('dist', 'src')
        const daoTypingsString = await fs.readFile(typeFileUrl, 'utf-8')
        const typeChunk1 = daoTypingsString.split('$$$!!')[1]

        const tsFnTypeChunks = typeChunk1
            .split('// *TMPLT')
            .map(chnk => chnk
                .replace(/^\s*\/\/.*/gm, '') // inline comments
                .replace(/^[^ ].+\n$/gm, '') // lines not starting with space
                .split('/*').map(txt => txt.split('*/')[1] || txt).join('') // remove comments (regexp is not performant at all)
                .split('\n').filter(l => l.trim()).join('\n') // remove empty lines
            )


        for (const tsChunkStr of tsFnTypeChunks) {
            const [actualMethod, type] = tsChunkStr
                .replace(/ +(\w+)(<|\()/, '$1£$2') // replace "  methodName<" by "methodName£<"
                .split('£')
            tsForMethod[dbType][actualMethod] ??= []
            tsForMethod[dbType][actualMethod].push(type)
        }
    }
    const ts = tsForMethod[dbType][fnName]
    if (typeof ts === 'undefined') error.serverError(null, `oneTypeIsNotDefinedInDaoTypeFile`, { method: fnName, availableMethods: Object.keys(tsForMethod[dbType]) })
    return ts
}


function routeToObjAddr(route: string) {
    return route
        .replace(/\//g, '.')
        .replace(/^\./, '')
        .replace('%%::!', '')
}

function sortRoutes(arrOfArr: [route: string, description: any][]) {
    return arrOfArr.sort(([routeA], [routeB]) => routeA[0].length - routeB[0].length)
}