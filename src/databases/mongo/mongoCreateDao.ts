


import mongoose from 'mongoose'
import { mongoBeforeRequest } from './mongoBeforeRequest'
import { mongoAfterRequest, catchMongoDbDuplicateError } from './mongoAfterRequest'

import { DaoMethodsBaseMongo, DaoMethodsMongo, RequestConfigRead } from './types/mongoDbTypes'
import { LocalConfigParsed } from './types/mongoDbTypes'
import { DaoGenericMethods, ModelReadWrite } from '../../types/core.types'

import { asArray, getId, deepClone, isset } from 'topkat-utils'
import type { AllDbIds, DbIds, ModelNames } from '../../cache/dbs/index.generated'

export async function mongoCreateDao<ModelTypes extends ModelReadWrite>(
    MongooseModel: mongoose.Model<any>,
    dbId: AllDbIds,
    dbName: keyof DbIds,
    modelName: ModelNames
) {

    type ModelRead = ModelTypes['Read']
    type Config = RequestConfigRead<ModelTypes['Read']>


    const dao: DaoMethodsBaseMongo<ModelTypes> = {
        //----------------------------------------
        // READ
        //----------------------------------------
        async getById(ctx, id, config?) {
            return await dao.getOne(ctx, { _id: getId(id) } as any, config) // * for any see mongoDbBaseTypes.ts
        },

        async getOne(ctx, filter?, config?) {
            const localConfig = getLocalConfigForRead('getOne', config, filter)
            await mongoBeforeRequest(ctx, localConfig)
            const promise = MongooseModel.findOne(localConfig.filter, null, { session: ctx.transactionSession })
            const result = await mongoAfterRequest<ModelRead, 'getOne', typeof localConfig>(ctx, promise, localConfig)
            if (config?.triggerErrorIfNotSet === true && !result) throw ctx.error.ressourceDoesNotExists({
                triggerErrorIfNotSetOption: true,
                filter,
                additionalMsg: 'RESSOURCE DO NOT EXIST',
                modelName: localConfig.modelName || localConfig.dbName,
                dbId: localConfig.dbId,
            })
            return result
        },

        async getAll(ctx, filter?, config?) {
            const localConfig = getLocalConfigForRead('getAll', config, filter)
            await mongoBeforeRequest(ctx, localConfig)
            const promise = MongooseModel.find(localConfig.filter, null, { session: ctx.transactionSession })
            const result = await mongoAfterRequest<ModelRead, 'getAll', typeof localConfig>(ctx, promise, localConfig, MongooseModel)
            return result as any
        },

        async getLastN(ctx, limit = 1, config) {
            return await getLastOrFirst(ctx, limit, config, false) as any
        },

        async getFirstN(ctx, limit = 1, config?) {
            return await getLastOrFirst(ctx, limit, config, true) as any
        },

        async count(ctx, filter = {}) {
            const localConfig = getLocalConfigForRead('getAll', {}, filter)
            await mongoBeforeRequest(ctx, localConfig)
            return await MongooseModel.countDocuments(localConfig.filter, { session: ctx.transactionSession })
        },

        //----------------------------------------
        // CREATE
        //----------------------------------------
        async create(ctx, fieldsOrArr?, config?) {
            const arrOfFields = asArray(deepClone(fieldsOrArr || {}))
            const results: string[] | ModelRead[] = []
            for (const fields of arrOfFields) {
                const localConfig = getLocalConfigForWrite('create', 'getOne', config, {}, fields) // we shall recreate each time for ref
                await mongoBeforeRequest(ctx, localConfig)
                if (!ctx.simulateRequest) {
                    let item
                    try {
                        item = await (new MongooseModel(localConfig.inputFields)).save({ session: ctx.transactionSession })
                    } catch (err) {
                        const { errmsg, code } = err
                        if (code === 11000) {
                            const { dbId, dbName, modelName, method, ressourceId } = localConfig
                            const extraInfs = { dbId, dbName, modelName, method, ressourceId }
                            catchMongoDbDuplicateError(ctx, errmsg, err, extraInfs)
                        } else throw err
                    }
                    const result = await getRessourceAfterUpdateIfReturnDocIsTrue(ctx, { _id: item._id }, localConfig, item._id.toString())
                    await mongoAfterRequest<ModelRead, 'create'>(ctx, result, localConfig)
                    results.push(result)
                }
            }
            return Array.isArray(fieldsOrArr) ? results : results[0] as any
        },

        //----------------------------------------
        // UPDATE
        //----------------------------------------
        async update(ctx, id, fields, config) {
            (fields as any)._id = id
            const localConfig = getLocalConfigForWrite('update', 'getOne', config, { _id: getId(id) }, fields)
            const results = await dao.updateMany(ctx, [fields as any], localConfig)
            return results[0] as any
        },

        async updateMany(ctx, fieldsArr, config) {
            const results = [] as ModelRead[]
            for (const fields of fieldsArr) {
                if (!isset(getId(fields))) throw ctx.error.serverError('_id field must be set when updating field', { fieldsOrArr: fieldsArr })
                const originalId = getId(fields)
                const localConfig = getLocalConfigForWrite('update', 'getAll', config, { _id: originalId }, fields)
                delete fields._id
                await mongoBeforeRequest(ctx, localConfig)
                if (localConfig.filter?._id !== originalId) throw ctx.error[403]({ originalId, allowedId: localConfig.filter?._id })
                if (!ctx.simulateRequest) {
                    const promise = MongooseModel.updateOne(localConfig.filter, localConfig.inputFields, { session: ctx.transactionSession })
                    await mongoAfterRequest<ModelRead, 'update'>(ctx, promise, localConfig)
                    if (localConfig.returnDoc) {
                        const updatedRessource = await getRessourceAfterUpdateIfReturnDocIsTrue(ctx, localConfig.filter, localConfig)
                        results.push(updatedRessource)
                    }
                }
            }
            return results as any
        },

        async upsert(ctx, fields, config?) {
            const ressourceId = getId(fields)
            const isUpdate = isset(ressourceId) && await dao.count(ctx.GM, { _id: ressourceId } as any) > 0
            const method = isUpdate ? 'update' : 'create'
            const localConfig = getLocalConfigForWrite(method, 'getOne', config, {}, fields)
            const result = isUpdate ? await dao.update(ctx, ressourceId, fields, localConfig) : await dao.create(ctx, fields, localConfig)
            return result || ressourceId as any
        },

        async updateWithFilter(ctx, filter, fields, config?) {
            const localConfig = getLocalConfigForWrite('update', 'getAll', config, filter, fields)
            await mongoBeforeRequest(ctx, localConfig)
            if (!ctx.isSystem && localConfig?.filter?._id) { // forcing _id filter since updateWithFilter is too powerful
                throw ctx.error[403]({ message: 'updateWithFilterNotAllowed', allowedId: localConfig.filter?._id })
            }
            if (!ctx.simulateRequest) {
                const returnVal = await MongooseModel.updateMany(filter, localConfig.inputFields, { session: ctx.transactionSession })
                await mongoAfterRequest<ModelRead, 'update'>(ctx, undefined, localConfig)
                return await getRessourceAfterUpdateIfReturnDocIsTrue(ctx, filter, localConfig, returnVal) as any // TODO
            }
        },

        //----------------------------------------
        // DELETE
        //----------------------------------------
        async delete(ctx, id) {
            await dao.deleteWithFilter(ctx, { _id: getId(id) } as any)
        },

        async deleteWithFilter(ctx, filter) {
            if (!ctx.isSystem && !filter._id) throw ctx.error[403]({ errorCode: '29667' })
            if (Object.keys(filter).length === 0) throw ctx.error.wrongValueForParam({ message: 'deleteWithFilterForbiddenWithEmptyFilter', filter })
            const localConfig = getLocalConfigForWrite('delete', 'getAll', undefined, filter)

            // if (daoConf.modelConfig?.hardDelete === false) {
            //     const fields = { isDeleted: true }
            //     localConfig.withDeleted = true
            //     const resp: any = await this.updateWithFilter(ctx, filter, fields, localConfig) || {}
            //     resp.hardDeleted = false
            //     return resp
            // } else {
            await mongoBeforeRequest(ctx, localConfig)
            if (!ctx.simulateRequest) {
                const resp = await MongooseModel.deleteMany(localConfig.filter, { session: ctx.transactionSession })
                return { success: true, deletedCount: resp.deletedCount, hardDeleted: true }
            }
            // }
        },
    }

    return {
        ...dao,
        simulateRequest: new Proxy(dao, {
            get(target, prop, receiver) {
                const value = target[prop]
                if (value instanceof Function) {
                    return function (this: typeof dao, ...args) {
                        const [ctx, ...otherArgs] = args
                        return value.apply(this === receiver ? target : this, [
                            ctx.clone({ simulateRequest: true }),
                            ...otherArgs
                        ])
                    }
                }
                return value
            },
        }),
    } as DaoMethodsMongo<ModelTypes>



    //----------------------------------------
    // HELPERS
    //----------------------------------------
    /** get extended and cleaned configuration for mongo request */
    function getLocalConfigForWrite<T extends Record<string, any>>(
        method: DaoGenericMethods,
        methodForRead: DaoGenericMethods,
        config: T | T & LocalConfigParsed = {} as T,
        filter = {},
        fields = {},
    ): T & LocalConfigParsed {
        let localConfig = {} as T & LocalConfigParsed
        if ('isLocalConfig' in config === false) { // CLONE CONFIG
            localConfig = (config ? deepClone(config) : {}) as T & LocalConfigParsed
            localConfig.isLocalConfig = true
            localConfig.method = method
            localConfig.methodForRead = methodForRead
            localConfig.dbName = dbName
            localConfig.dbId = dbId
            localConfig.modelName = modelName
        } else { // IS ALREADY LOCAL
            localConfig = { ...config, method } as T & LocalConfigParsed
        }
        localConfig.filter = filter || {}
        localConfig.inputFields = fields ? { ...fields } : {} // avoid modifying ref
        return localConfig
    }

    function getLocalConfigForRead<T extends Record<string, any>>(
        method: DaoGenericMethods,
        config: T | T & LocalConfigParsed = {} as T,
        filter = {},
    ): T & LocalConfigParsed {
        let localConfig = {} as T & LocalConfigParsed
        if ('isLocalConfig' in config === false) { // perf avoid repeating a clone
            localConfig = (config ? deepClone(config) : {}) as T & LocalConfigParsed
            localConfig.isLocalConfig = true
            localConfig.method = method
            localConfig.methodForRead = method
            localConfig.dbName = dbName
            localConfig.dbId = dbId
            localConfig.modelName = modelName
        } else localConfig = { ...config, method } as T & LocalConfigParsed
        localConfig.filter = filter || {}
        return localConfig
    }

    async function getRessourceAfterUpdateIfReturnDocIsTrue(
        ctx: Ctx,
        filter: any,
        localConfig: any,
        returnValueElse?: any
    ) {
        if (localConfig.returnDoc) {
            const readLocalConfig = { ...localConfig }
            readLocalConfig.method = readLocalConfig.methodForRead
            if (readLocalConfig.methodForRead === 'getOne') {
                return await dao.getOne(ctx, filter, readLocalConfig)
            } else {
                return await dao.getAll(ctx, filter, readLocalConfig)
            }
        } else return returnValueElse
    }

    async function getLastOrFirst(ctx: Ctx, limit, config: Config, getFirst: boolean) {
        const localConfig = getLocalConfigForRead('getAll', config)
        await mongoBeforeRequest(ctx, localConfig)
        const promise = MongooseModel.find(localConfig.filter || {}, null, { session: ctx.transactionSession })
            .sort({ $natural: getFirst ? 1 : -1 })
            .skip((localConfig.page || 0) * limit)
            .limit(limit)
        const result = await mongoAfterRequest<ModelRead, 'getAll', typeof localConfig>(ctx, promise, localConfig, MongooseModel)
        return result
    }
}