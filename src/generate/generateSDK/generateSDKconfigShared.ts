
import { GenerateSdkConfig, ServiceDocObject } from '../../types/core.types.js'
import { camelCase } from 'topkat-utils'
import { GenericDef } from '../../lib/good-cop/src/index.js'
import { generateJsDoc } from './generateJsDocForSdk.js'

export const env = process.env.NODE_ENV as Env

export const generateSdkConfigDefault: Partial<GenerateSdkConfig> = {
    isEs6Import: false,
    processAddrInSdk(addrRaw) {
        // TODO make more generic ?? actually dao should not come there
        const addrBits = addrRaw
            .replace(/\./g, '-') // replace '.' by '-'
            .replace(/([a-z])([A-Z])/g, '$1-$2') // uncamelcaseify
            .toLowerCase()
            .split('-')
        return camelCase(addrBits)
    },
    shallExposeRoute: () => true
}


export function getTsTypeAsStringAndRouteClean(
    queryName: string,
    originalApiAddr: string,
    objectTs: Record<string, string>,
    ts: string[],
    outputValidator: GenericDef,
    doc?: ServiceDocObject
) {
    const routeClean = originalApiAddr.replace(/\./g, '/') // replace a.b => a/b
    if (doc) objectTs[queryName + '__COMMENT__'] = generateJsDoc(doc, outputValidator)

    const tsTypesAsString = ts.map(str => str.replace(/ +ctx: Ctx,\n/, '')) // TODO remove this once using the right type for dao-types => https://stackoverflow.com/questions/76853143/typescript-getting-returntype-of-a-function-called-with-certains-parameter-types

    objectTs[queryName] = tsTypesAsString.join(`\n    ${queryName}`)

    return { routeClean, tsTypesAsString }
}