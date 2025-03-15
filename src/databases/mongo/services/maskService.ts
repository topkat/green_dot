

import { appliableHooksForUser } from '../../0_hooks/appliableHookForUser'
import { forEachPopulateFieldRecursive } from './populateService'
import { throwError } from '../../../core.error'
import { PopulateConfig, PopulateConfigWithoutStringSyntax } from '../types/mongoDbTypes'
import { DaoGenericMethods, MaskHook, DaoHookSharedParsed } from '../../../types/core.types'
import { getProjectDatabaseModels } from '../../../helpers/getProjectModelsAndDaos'

import { getId, objForceWrite, escapeRegexp, flattenObject, unflattenObject } from 'topkat-utils'
import { getProjectDatabaseDaos } from '../../../helpers/getProjectModelsAndDaos'

export type Mask<T = any> = DaoHookSharedParsed & MaskHook<T>
export type MaskObjFlat = Record<string, boolean>

//----------------------------------------
// MAIN
//----------------------------------------
export async function applyMaskIncludingOnPopulatedFieldsRecursive<ModelName extends string, T extends Record<string, any>>(
    ctx: Ctx,
    method: DaoGenericMethods,
    dbName: string,
    modelName: ModelName,
    fields: T,
    recursive = true
): Promise<T> {

    const newFieldsParent = await applyMaskOnObjectForUser(ctx, dbName, modelName, method, fields)

    if (recursive) await forEachPopulateFieldRecursive(dbName, modelName, newFieldsParent, async (val, fieldAddr, parent, modelName) => {
        if (val && typeof val !== 'string') {
            const newFields = await applyMaskOnObjectForUser(ctx, dbName, modelName, method, val)
            parent[fieldAddr] = newFields
        }
    })

    return newFieldsParent
}

export async function applyMaskOnObjectForUser<T extends Record<string, any>>(
    ctx: Ctx,
    dbName: string,
    modelName: string,
    method: DaoGenericMethods,
    obj: T
): Promise<T> {
    const daos = await getProjectDatabaseDaos()
    const maskHooksForModel = daos[dbName][modelName].mask || []
    const maskFromCache = retrieveMaskFromCacheOrDelete(ctx, modelName, method)
    if (maskFromCache) return applyMaskFlatToModel(maskFromCache.mask, obj)
    const maskHooksForUser = await appliableHooksForUser(ctx, maskHooksForModel, method, 'alwaysReturnFalse', hook => hook.select ? 'alwaysReturnFalse' : 'alwaysReturnTrue')
    const { mask } = await combineMaskHooksAndReturnMaskOrSelectAddrArray(ctx, dbName, modelName, maskHooksForUser, method)
    return mask.length ? applyMaskFlatToModel(mask, obj) : obj
}

/** @returns array of field adresses like `organization.team[0].name` /!\ it will not return fields with mongo format, organization.team[0].name should be transformed to organization.team.name
 *
 * Note that _id field is never present in neither mask nor select
 * NOTE 2 /!\ IF THERE IS A SELECT, THE SELECT WINS OVER THE MASK
 */
export async function combineMaskHooksAndReturnMaskOrSelectAddrArray(
    ctx: Ctx,
    dbName: string,
    modelName: string,
    maskHooks: Mask[],
    method: DaoGenericMethods
): Promise<{ mask: string[] }> {

    if (!maskHooks?.length) return { mask: [] }

    const maskFromCache = retrieveMaskFromCacheOrDelete(ctx, modelName, method)
    if (maskFromCache) return maskFromCache

    const allAdresses: string[] = []
    let maskedAdresses: string[] = []

    const models = await getProjectDatabaseModels()

    const modelFlat = models[dbName][modelName]._getDefinitionObjFlat()

    Object.entries(modelFlat).forEach(([addr, def]) => {
        if (!def.getDefinitionValue('isParent') && addr !== '_id') {
            allAdresses.push(addr)
        }
    })

    const regexps: (string | RegExp)[] = []
    const selectHooks = maskHooks.filter(h => typeof h.select === 'function')
    const isSelect = selectHooks.length
    const hooks = isSelect ? selectHooks : maskHooks

    hooks.forEach(mh => {
        const fn = mh.mask || mh.select
        const addresses = Object.keys(flattenObject(fn(ctx)))
        const addrRegexpes = addresses.map(m => convertAddrToRegexpIfWildCard(m))
        regexps.push(...addrRegexpes)
    })

    if (isSelect) {
        // SELECT
        maskedAdresses = allAdresses
        for (const selectReg of regexps) {
            maskedAdresses = maskedAdresses.filter(addr => {
                // FILTER ALL ADDR THAT DOESN'T MATCH SELECT
                return typeof selectReg === 'string' ? !matchAddress(selectReg, addr) : !selectReg.test(addr)
            })
        }
    } else {
        // MASK
        for (const maskReg of regexps) {
            for (const addr of allAdresses) {
                const doMatch = typeof maskReg === 'string' ? matchAddress(maskReg, addr) : maskReg.test(addr)
                if (doMatch) {
                    const addrToMask = typeof maskReg === 'string' ? maskReg : addr // allow shortcut when nested object root masked
                    if (!maskedAdresses.includes(addrToMask)) maskedAdresses.push(addrToMask)
                }
            }
        }
    }

    // CACHE
    objForceWrite(maskCache, `${getId(ctx)}.${modelName}.${method}`, { mask: maskedAdresses, validUntil: Date.now() + cacheMinutes })

    return { mask: maskedAdresses }
}



/** Simply apply maskFlat to a set of fields. MaskFlat is generated by combineAndParseMaskHooks() */
function applyMaskFlatToModel<T extends Record<string, any>>(
    adresses: string[],
    fields: T
): T {
    const isMask = true
    const shouldMatchRegexp = adresses.map(addr => {
        // transform organization.teams[0] TO organization.teams[*]
        if (addr.includes('[')) return convertAddrToRegexpIfWildCard(addr.replace(/\[\d\]/g, '[*]'))
        else return addr
    })

    const objFlat = flattenObject(fields)
    const responseFlat = isMask ? objFlat : { _id: getId(objFlat) }

    for (const addrRegexp of shouldMatchRegexp) {
        for (const address in objFlat) {
            const doMatch = typeof addrRegexp === 'string' ? (addrRegexp === address || address.startsWith(addrRegexp + '.') || address.startsWith(addrRegexp + '[')) : addrRegexp.test(address)
            if (doMatch) {
                // should be deleted
                if (isMask) delete responseFlat[address]
                // should be added
                else responseFlat[address] = objFlat[address]
            }
        }
    }

    return unflattenObject(responseFlat) as T
}

//----------------------------------------
// FOR POPULATE
//----------------------------------------
export async function applyMaskToPopulateConfig(
    ctx: Ctx,
    conf: PopulateConfig<any>[],
    dbName: string,
    baseModelName: string,
    method: DaoGenericMethods
) {
    const newPopArr = [] as PopulateConfigWithoutStringSyntax<any>[]
    const models = await getProjectDatabaseModels()
    const modelFlat = models[dbName][baseModelName]._getDefinitionObjFlat(true)

    for (const popConf of conf) {

        const populateConfObj = (typeof popConf === 'string' ? { path: popConf } : popConf) as PopulateConfigWithoutStringSyntax<any>

        const fieldName = populateConfObj.path
        const modelNameForField = modelFlat?.[fieldName]?._refValue

        if (populateConfObj.select && typeof populateConfObj.select !== 'string') throwError.wrongValueForParam(ctx, { msg: `onlyStringTypeIsAllowedInPopulateSelect`, fieldName, popConf })
        if (!modelNameForField) throwError.wrongValueForParam(ctx, { msg: `modelDoNotExistForFieldNameInPopulate`, fieldName, popConf, fnName: 'applyMaskToPopulateConfig' })

        if ('populate' in populateConfObj) {
            populateConfObj.populate = await applyMaskToPopulateConfig(ctx, populateConfObj.populate, dbName, modelNameForField, method)
        }

        const maskArrFromhook = await getMongoMaskForUser(ctx, method, dbName, modelNameForField)

        if (maskArrFromhook.length) {
            if (populateConfObj.select) {
                // The difficulty here is to combine select OR mask defined by the user
                // with select OR mask outputed by path match hooks
                // so everything will be converted to MASK so it can be concatenated
                const selectOrMaskFromUser = populateConfObj.select.split(' ')
                const isExclude = selectOrMaskFromUser[0].startsWith('-')

                const maskFromUser = isExclude ? selectOrMaskFromUser.filter(f => f.startsWith('-')) : (await getMaskFromSelect(selectOrMaskFromUser, dbName, modelNameForField)).map(v => '-' + v)

                for (const field of maskFromUser) {
                    if (!maskArrFromhook.includes(field)) maskArrFromhook.push(field)
                }
            }
            populateConfObj.select = maskArrFromhook.join(' ')
        }
        newPopArr.push(populateConfObj)
    }
    return newPopArr
}

//----------------------------------------
// HELPERS
//----------------------------------------

export async function getMaskFromSelect(selectArr: string[], dbName: string, modelName: string) {
    const models = await getProjectDatabaseModels()
    const fields = models[dbName][modelName]._getDefinitionObjFlat(true)
    let allFieldsAddr = Object.keys(fields)
    for (const fieldName of selectArr) {
        // const fieldName = fieldName.replace('-', '')
        allFieldsAddr = allFieldsAddr.filter(f => !f.startsWith(fieldName))
    }
    return allFieldsAddr.filter(f => f !== '_id')
}

/** @returns mongo select array to put in .select() (Eg. ['name', 'phone']) no negative ('-feldName') will be returned */
export async function getMongoMaskForUser(
    ctx: Ctx,
    method: DaoGenericMethods,
    dbName: string,
    modelName: string
) {
    const daos = await getProjectDatabaseDaos()
    const maskHooksForModel = daos[dbName][modelName].mask || []
    const maskHooksForUser = await appliableHooksForUser(
        ctx,
        maskHooksForModel,
        method,
        'alwaysReturnFalse',
        hook => hook.select ? 'alwaysReturnFalse' : 'alwaysReturnTrue',
    )
    const { mask } = await combineMaskHooksAndReturnMaskOrSelectAddrArray(ctx, dbName, modelName, maskHooksForUser, method)
    return mask.map(e => '-' + e.replace(/\[\d+\]/g, '')) // replace array syntax user[0].name => user.name
}

function convertAddrToRegexpIfWildCard(shouldMatchAddr: string): string | RegExp {
    if (shouldMatchAddr.includes('*')) {
        const regexp = escapeRegexp(shouldMatchAddr, { parseStarChar: true })
        const regStr = '^' + regexp
        return new RegExp(regStr)
    } else return shouldMatchAddr
}

function matchAddress(strMatch: string, addr: string) {
    return addr === strMatch || addr.startsWith(strMatch + '.') || addr.startsWith(strMatch + '[')
}

//----------------------------------------
// CACHING
//----------------------------------------
const cacheMinutes = 1000 * 60 * 2
type CacheEndpoint = { validUntil: number, mask: string[] }
const maskCache = {} as { [userId: string]: { [modelName: string]: { [method: string]: CacheEndpoint } } }
const retrieveMaskFromCacheOrDelete = (ctx: Ctx, modelName: string, method: string): CacheEndpoint | void => {
    const userId = ctx.isSystem ? 'system' : getId(ctx)
    if (maskCache[userId]?.[modelName]?.[method]) {
        // combineAndParseMaskHooks are trigged multiple times by request, so better caching it
        const { validUntil } = maskCache[userId][modelName][method]
        if (validUntil < Date.now()) delete maskCache[userId][modelName][method]
        else return maskCache[userId][modelName][method]
    }
}