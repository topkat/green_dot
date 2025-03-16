
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//
// /!\ DANGER ZONE /!\
// ==> DAO TYPINGS <==
// /!\ DANGER ZONE /!\
//
// please manipulate carrefully, this file is used as a string
// for generating SDK types and is generally used all across
// the backend to guarantee app coherence and reliability
//
// TAKE CARE to verify type COHERENCE across ts typings,
// params validator and ts string for generated files so
// that runtime and devTime types are always aligned
//
// /!\ Points of attention: /!\
// * New methods shall be added to DaoMethodsFull in mongoDbTypes AND here below
// * daoHookNamesMongo type in mongoDbTypes
// * types used for templating shall not depend on other types than the ones defined in mongoDaoTypes
//
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

import { ModelReadWrite, ServiceDocObject } from '../../../types/core.types'
import { requestConfigReadEXPOSED, requestConfigGetOne, requestConfigWrite } from './mongoDbTypes'
import type { Definition, GenericDef } from 'good-cop'
import { _ } from 'good-cop'

import { AsFilter, AsMongooseBody, RequestConfigRead, RequestConfigGetOne, RequestConfigWrite, MaybePaginated } from './mongoDbBaseTypes'
import { objEntries } from 'topkat-utils'
export * from './mongoDbBaseTypes'


//  ══╦══ ╦   ╦ ╔══╗ ╔══╗ ╔═══
//    ║   ╚═╦═╝ ╠══╝ ╠═   ╚══╗
//    ╩     ╩   ╩    ╚══╝ ═══╝
export type DaoMethodsBaseMongo<ModelTypes extends ModelReadWrite> = {
    // $$$!! // DO NOT REMOVE USED FOR TEMPLATING
    getById<Config extends RequestConfigGetOne<ModelTypes['Read']>>(
        ctx: Ctx,
        id: string,
        config?: Config
    ): Promise<Config['triggerErrorIfNotSet'] extends true ? ModelTypes['Read'] : ModelTypes['Read'] | undefined>
    // *TMPLT
    getOne<Config extends Omit<RequestConfigGetOne<ModelTypes['Read']>, 'filter'>>(
        ctx: Ctx,
        filter?: AsFilter<ModelTypes['Write']>, // WRITE HERE because it will ensure referenced fields are passed as their string counterpart
        config?: Config
    ): Promise<Config['triggerErrorIfNotSet'] extends true ? ModelTypes['Read'] : ModelTypes['Read'] | undefined>
    // *TMPLT
    // /!\ two getAll because that's the only way I have found for hours of trial error that when config is not set it doesn't return paginated data
    getAll(
        ctx: Ctx,
        filter?: AsFilter<ModelTypes['Write']>,
        config?: never
    ): Promise<ModelTypes['Read'][]>
    // *TMPLT
    getAll<Config extends Omit<RequestConfigRead<ModelTypes['Read']>, 'filter'>>(
        ctx: Ctx,
        filter?: AsFilter<ModelTypes['Write']>,
        config?: Config
    ): Promise<MaybePaginated<ModelTypes['Read'][], Config>>
    // *TMPLT
    /** By default return the last element created in the database. Change the limit to return more elements */
    getLastN(
        ctx: Ctx,
        limit?: number,
        config?: never,
    ): Promise<ModelTypes['Read'][]>
    // *TMPLT
    getLastN<Config extends RequestConfigRead<ModelTypes['Read']>>(
        ctx: Ctx,
        limit?: number,
        config?: Config,
    ): Promise<MaybePaginated<ModelTypes['Read'][], Config>>
    // *TMPLT
    /** By default return the first element created in the database. Change the limit to return more elements */
    getFirstN(
        ctx: Ctx,
        limit?: number,
        config?: never
    ): Promise<ModelTypes['Read'][]>
    // *TMPLT
    getFirstN<Config extends RequestConfigRead<ModelTypes['Read']>>(
        ctx: Ctx,
        limit?: number,
        config?: Config
    ): Promise<MaybePaginated<ModelTypes['Read'][], Config>>
    // *TMPLT
    count(
        ctx: Ctx,
        filter?: AsFilter<ModelTypes['Write']>
    ): Promise<number>
    // *TMPLT
    /** return the objectId of the created ressource by default. You can return the created object by setting `returnDoc: true` option */
    create<
        Config extends RequestConfigWrite<ModelTypes['Write']>,
        Body extends MaybeArray<ModelTypes['Write']>
    >(
        ctx: Ctx,
        body: Body,
        config?: Config
    ): Promise<
        Config['returnDoc'] extends true ?
        Body extends any[] ? ModelTypes['Read'][] : ModelTypes['Read'] :
        Body extends any[] ? string[] : string
    >
    // *TMPLT
    /** return nothing by default. You can return the updated object by setting `returnDoc: true` option */
    update<
        Config extends RequestConfigWrite<ModelTypes['Write']>
    >(
        ctx: Ctx,
        id: string,
        body: Partial<AsMongooseBody<ModelTypes['Write']>>,
        config?: Config
    ): Promise<
        Config['returnDoc'] extends true ? ModelTypes['Read'] : undefined
    >
    // *TMPLT
    /** _id should be provided in each one of the fields array  */
    updateMany<
        Config extends RequestConfigWrite<ModelTypes['Write']>
    >(
        ctx: Ctx,
        fields: Array<Partial<AsMongooseBody<ModelTypes['Write']>> & { _id: string }>, // id is provided in the body
        config?: Config
    ): Promise<
        Config['returnDoc'] extends true ? ModelTypes['Read'][] : undefined
    >
    // *TMPLT
    /** @returns document or id depending on config.returnDoc */
    upsert<Config extends RequestConfigWrite<ModelTypes['Write']>>(
        ctx: Ctx,
        fields: ModelTypes['Write'] & { _id?: string },
        config?: Config
    ): Promise<Config['returnDoc'] extends true ? ModelTypes['Read'] : string>
    // *TMPLT
    updateWithFilter<Config extends RequestConfigWrite<ModelTypes['Write']>>(
        ctx: Ctx,
        filter: AsFilter<ModelTypes['Write']>,
        fields: Partial<AsMongooseBody<ModelTypes['Write']>>,
        config?: Config
    ): Promise<
        Config['returnDoc'] extends true ? ModelTypes['Read'][] : {
            acknowledged: boolean
            matchedCount: number
            modifiedCount: number
            upsertedCount: number
            upsertedId: any
        }
    >
    // *TMPLT
    delete(
        ctx: Ctx,
        id: string
    ): Promise<void>
    // *TMPLT
    deleteWithFilter(
        ctx: Ctx,
        filter: AsFilter<ModelTypes['Write']>
    ): Promise<{ success: true, deletedCount: number, hardDeleted: boolean }>
    // $$$!! // DO NOT REMOVE USED FOR TEMPLATING
}


export type DaoMethodsMongo<ModelTypes extends ModelReadWrite> = DaoMethodsBaseMongo<ModelTypes> & {
    simulateRequest: Omit<DaoMethodsBaseMongo<ModelTypes>, 'getById' | 'getOne' | 'getAll' | 'getLastN' | 'getFirstN' | 'count'>
}


//  ╦  ╦ ╔══╗ ╦    ═╦═ ╔═╗  ╔══╗ ══╦══ ╔══╗ ╔══╗ ╔═══
//  ╚╗ ║ ╠══╣ ║     ║  ║  ║ ╠══╣   ║   ║  ║ ╠═╦╝ ╚══╗
//   ╚═╝ ╩  ╩ ╚══╝ ═╩═ ╚══╝ ╩  ╩   ╩   ╚══╝ ╩ ╚  ═══╝

const getErrExtraInf = (obj: Record<string, GenericDef & { errorExtraInfos }>) => {
    const defs = Object.entries(obj).map(([fieldName, def], i) => def.errorExtraInfos({ paramName: fieldName, paramNumber: i }))
    return _.tuple(defs) as any as Definition
}
const modelType = _.object({}) // removed model because it causes computing model validation twice

/** This is necessary to validate dao calls at runtime since
 * ts cannot do that, we need paramsValidator to validate params
 * sent via api
 */
export const daoValidators = {
    getById: {
        doc: {
            description: `Allow to get a ressource by it's unique mongoDb _id`,
            errors: [
                [404, 'ressourceDoesNotExists']
            ]
        },
        paramsValidator: getErrExtraInf({
            id: _.string(),
            config: _.object(requestConfigGetOne, { deleteForeignKeys: true }).optional()
        }),
        method: 'getOne',
        output: modelDef => modelDef as Definition,
    },
    getOne: {
        doc: { description: `Allow to get a ressource with providing a filter as first param` },
        paramsValidator: getErrExtraInf({
            config: _.object(requestConfigGetOne, { deleteForeignKeys: true }).optional()
        }),
        method: 'getOne',
        output: modelDef => modelDef as Definition,
    },
    getAll: {
        doc: { description: `Allow to get all ressources with providing a filter as first param` },
        paramsValidator: getErrExtraInf({
            filter: _.object().optional(),
            config: _.object(requestConfigReadEXPOSED, { deleteForeignKeys: true }).optional()
        }),
        method: 'getAll',
        output: modelDef => _.array(modelDef) as any as Definition,
    },
    getLastN: {
        doc: { description: `Allow to get the last ressources by creation date` },
        paramsValidator: getErrExtraInf({
            limit: _.number().optional(),
            config: _.object(requestConfigReadEXPOSED, { deleteForeignKeys: true }).optional()
        }),
        method: 'getAll',
        output: modelDef => _.array(modelDef) as any as Definition,
    },
    getFirstN: {
        doc: { description: `Allow to get the first ressources by creation date` },
        paramsValidator: getErrExtraInf({
            limit: _.number().optional(),
            config: _.object(requestConfigReadEXPOSED, { deleteForeignKeys: true }).optional()
        }),
        method: 'getAll',
        output: modelDef => _.array(modelDef) as any as Definition,
    },
    count: {
        doc: { description: `Count the number of ressources matching the filter in first param or all ressources if no filter is provided` },
        paramsValidator: getErrExtraInf({
            filter: _.object().optional(),
        }),
        method: 'getAll',
        output: _.number() as any as Definition,
    },
    create: {

        doc: {
            description: `Create a new document`,
        },
        paramsValidator: getErrExtraInf({
            fields: _.typesOr([_.array(modelType), modelType]).required(),
            config: _.object(requestConfigWrite, { deleteForeignKeys: true }).optional()
        }),
        method: 'create',
        output: _.void() as any as Definition,
    },
    update: {
        doc: {
            description: `Update a given document. An _id should be provided.`,
        },
        paramsValidator: getErrExtraInf({
            ressourceId: _.string().required(),
            fields: modelType.required(),
            config: _.object(requestConfigWrite, { deleteForeignKeys: true }).optional()
        }),
        method: 'update',
        output: _.void() as any as Definition,
    },
    updateMany: {
        doc: {
            description: `Update multiple unique documents. Each document must have an _id field`,
            errors: [
                [403, 'userDoNotHaveThePermission']
            ]
        },
        paramsValidator: getErrExtraInf({
            fields: _.array(modelType).required(),
            config: _.object(requestConfigWrite, { deleteForeignKeys: true }).optional()
        }),
        method: 'update',
        output: _.void() as any as Definition,
    },
    upsert: {
        doc: {
            description: `Update or create document if not existing`
        },
        paramsValidator: getErrExtraInf({
            fields: modelType.required(),
            config: _.object(requestConfigWrite, { deleteForeignKeys: true }).optional()
        }),
        method: 'update',
        output: _.void() as any as Definition,
    },
    updateWithFilter: {
        doc: {
            description: `Update documents matching the filter in the first param or all documents if filter is not provided`,
            errors: [
                [403, 'updateWithFilterNotAllowed']
            ]
        },
        paramsValidator: getErrExtraInf({
            filter: _.object().required(),
            fields: modelType.required(),
            config: _.object(requestConfigWrite, { deleteForeignKeys: true }).optional()
        }),
        method: 'update',
        output: _.void() as any as Definition,
    },
    delete: {
        doc: {
            description: `Delete a document`
        },
        paramsValidator: getErrExtraInf({
            id: _.string().required()
        }),
        method: 'delete',
        output: _.void() as any as Definition,
    },
    deleteWithFilter: {
        doc: {
            description: `Delete all documents matching a filter`,
            errors: [
                [422, 'wrongValueForParam', 'When the filter is an empty object'],
                [403, 'userDoNotHaveThePermission', 'When using deleteWithFilter with something else than system permission'],
            ]
        },
        paramsValidator: getErrExtraInf({
            filter: _.object().required(),
        }),
        method: 'delete',
        output: _.void() as any as Definition,
    },
} satisfies Record<MongoDaoMethodsFull, DaoTypingValuesMongo>

//  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ═╦═ ╔══╗   ══╦══ ╦   ╦ ╔══╗ ╔══╗ ╔═══
//  ║ ═╦ ╠═   ║╚╗║ ╠═   ╠═╦╝  ║  ║        ║   ╚═╦═╝ ╠══╝ ╠═   ╚══╗
//  ╚══╝ ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚  ═╩═ ╚══╝     ╩     ╩   ╩    ╚══╝ ═══╝

// cannot use core-types here because this file will be copied
// in generated api sdk
// duplicated but will throw an err if not synced when changed
// in core types so chill out
// const daoMethodsFull = ['getById', 'getOne', 'getAll', 'getLastN', 'getFirstN', 'count', 'create', 'update', 'upsert', 'updateWithFilter', 'delete', 'deleteWithFilter'] as const
const daoGenericMethods = ['create', 'update', 'delete', 'getAll', 'getOne'] as const
type DaoGenericMethods = typeof daoGenericMethods[number]

export type DaoTypingValuesMongo = {
    doc?: ServiceDocObject
    paramsValidator: Definition
    method: DaoGenericMethods
    pathParamNb?: number
    output: Definition | ((modelDef: GenericDef) => Definition)
}


export type MongoDaoMethodsFull = keyof Readonly<DaoMethodsBaseMongo<any>>

export const mongoDaoREADMethodsFull = ['getById', 'getOne', 'getAll', 'getLastN', 'getFirstN', 'count'] satisfies MongoDaoMethodsFull[]


const daoMethodsGenericToDaoMethodFull = {} as Record<DaoGenericMethods, MongoDaoMethodsFull[]>
const mongoDaoMethodsFull = [] as MongoDaoMethodsFull[]
for (const [methodNameFull, config] of objEntries(daoValidators)) {
    daoMethodsGenericToDaoMethodFull[config.method] ??= []
    daoMethodsGenericToDaoMethodFull[config.method].push(methodNameFull)
    mongoDaoMethodsFull.push(methodNameFull)
}
export {
    daoMethodsGenericToDaoMethodFull,
    mongoDaoMethodsFull,
}