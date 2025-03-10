import { DaoHookShared, DaoHookSharedParsed, DaoShared, DaoSharedParsed, daoHookNamesShared, DaoGenericMethods, MaskHook, ModelReadWrite } from '../../../types/core.types'
import mongoose from 'mongoose'
import { AsFilter, RequestConfigGetOne, RequestConfigRead, RequestConfigWrite, PopulateConfig, SortConfig } from './mongoDaoTypes'

export * from './mongoDaoTypes'


export const daoHookNamesMongo = [...daoHookNamesShared, 'filter', 'mask'] as const
export type DaoHookNamesMongo = typeof daoHookNamesMongo[number]

export type LocalConfigParsed = {
    dbName: string
    dbId: string,
    modelName: string
    method: DaoGenericMethods
    /** provided for write method to specify which config is used when returning document */
    methodForRead: DaoGenericMethods
    isLocalConfig: true
    filter: AsFilter<any>
    withDeleted?: boolean // may be used when retrieving archived datas
    inputFields?: Record<string, any>
    ressourceId?: string
    filterSanitized?: boolean
    // isHardDelete: boolean
} & (RequestConfigGetOne<any> | RequestConfigRead<any> | RequestConfigWrite<any>)

type MongoDaoShared<
    ModelTypes extends ModelReadWrite,
    DaoConf extends DaoHookShared | DaoHookSharedParsed
> = NoExtraProperties<{
    /** configs for mongoose models */
    modelConfig?: {
        indexes?: string[]
        /** if false, it will not delete anything, instead it will turn isDeleted field to true and thus will be filtered from all get requests */
        // hardDelete?: boolean // TODO
    },
    /** Allow a path to match a certain pattern, please return string in format '* /* /blah...' (without white spaces)
    * TODO allow also type string
    */
    mask?: NoExtraProperties<DaoConf & MaskHook<ModelTypes['Read']>>[]
    /** Allow to filter allowed data when fields contains a certain value or on custom code
     * * Use a function to modify exisitng filter
     * * OR use a filter object that is going to be merged with actual filter with precedence
    */
    filter?: (DaoConf & {
        filter: (ctx: Ctx & LocalConfigParsed, filter: AsFilter<ModelTypes['Read']>) => void | Promise<void> | ObjectGeneric | Promise<ObjectGeneric> |
            AsFilter<ModelTypes['Read']>
    })[]
    /** configure populate for all requests */
    populate?: PopulateConfig<ModelTypes['Read']>[]
    /** configure sorting for all requests */
    sort?: SortConfig<ModelTypes['Read']>
}>

export type MongoDao<ModelTypes extends ModelReadWrite> = DaoShared & Partial<MongoDaoShared<ModelTypes, DaoHookShared>> & { type: 'mongo' }

export type MongoDaoParsed<ModelTypes extends ModelReadWrite> = DaoSharedParsed & MongoDaoShared<ModelTypes, DaoHookSharedParsed> & { type: 'mongo' }

export type MongoHooks = { [dbName: string]: { [modelName: string]: MongoDaoParsed<any> } }

export type MongoConnexionConfigs<DbNames extends string> = {
    [dbName in DbNames]: {
        /** Useful if there is one DB in the project
         * * ALLOW ctx.db.dbTypeName.collectionNameGetAll()
         * * INSTEAD OF ctx.db.dbTypeName.dbName.collectionNameGetAll() */
        databaseURL: string
        mongoOptions?: mongoose.ConnectOptions
    }
}

export type MongooseConnexion = mongoose.Connection