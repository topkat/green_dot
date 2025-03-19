
import mongoose from 'mongoose'
import event from '../../event'
import { applyMaskToPopulateConfig, getMongoMaskForUser } from './services/maskService'
import { MongoDaoParsed } from './types/mongoDbTypes'

import { DaoGenericMethods, CreateEventAfterCtx, UpdateEventCtx, DeleteEventCtx, GetAllEventAfterCtx, GetOneEventAfterCtx } from '../../types/core.types'
import { PaginationData, MaybePaginated } from './types/mongoDaoTypes'
import { LocalConfigParsed } from './types/mongoDbTypes'

import { firstMatch } from 'topkat-utils'
import { getActiveAppConfig } from '../../helpers/getGreenDotConfigs'

type MongooseReqRead = mongoose.Query<any[], any, {}, any, 'find'> | mongoose.Query<any, any, {}, any, 'findOne'>
type MongooseReqDel = mongoose.Query<mongoose.mongo.DeleteResult, any, {}, any, 'deleteMany'>

export async function mongoAfterRequest<
    ModelRead,
    Method extends DaoGenericMethods,
    Config extends LocalConfigParsed = any
>(
    ctx,
    hooks: MongoDaoParsed<any>,
    promise: Method extends 'delete' ? MongooseReqDel : Method extends 'create' | 'update' ? string | ModelRead | void | mongoose.Query<any, any, {}, any, 'findOneAndUpdate'> : MongooseReqRead,
    localConfig: Config,
    ...[model]: Method extends 'getAll' ? [mongoose.Model<any>] : [] // => if method === 'getAll' parameter is required. Unreadable but type safe https://stackoverflow.com/questions/52318011/optional-parameters-based-on-conditional-types
): Promise<Method extends 'create' ? void : Method extends 'getAll' ? MaybePaginated<ModelRead[], Config> : ModelRead> {
    try {

        const appConfig = await getActiveAppConfig()

        const { method, modelName, dbName, populate = [], inputFields, ressourceId, populateAsAdmin = false } = localConfig
        const isRead = method === 'getAll' || method === 'getOne'

        const isMongooseQuery = promise instanceof mongoose.Query
        let paginationData: PaginationData

        if (isRead && isMongooseQuery) {
            // MASK FIRST LEVEL FIELDS
            const maskArr = await getMongoMaskForUser(ctx, method, dbName, modelName)
            if (maskArr.length) promise.select(maskArr.join(' '))

            // POPULATE
            if (hooks.populate) populate.unshift(...hooks.populate)
            if (populate?.length && !populateAsAdmin) {
                await applyMaskToPopulateConfig(ctx, populate, dbName, modelName, method)
            }
            populate.forEach(p => promise.populate(p as any))

            if (method === 'getAll') {
                // SORTING
                if (typeof (promise as any)?.options?.sort?.$natural !== 'number') { // if getFirst / Last is used, sorting is disabled and also leads to a bug
                    if (hooks.sort) promise.sort(hooks.sort)
                    if ('sort' in localConfig && Object.keys(localConfig.sort).length > 0) promise.sort(localConfig.sort)
                }

                // PAGINATION and LIMIT
                if ('page' in localConfig && typeof localConfig.page === 'number') {
                    const limit = 'limit' in localConfig ? localConfig.limit : appConfig.defaultPaginationLimit || 25
                    promise.skip(localConfig.page * limit).limit(limit)
                    paginationData = {
                        page: localConfig.page,
                        limit,
                        total: await model.countDocuments(localConfig.filter).exec() || 0
                    }
                } else if ('limit' in localConfig) promise.limit(localConfig.limit)
            }
        }

        if (promise instanceof mongoose.Query) {
            // avoid creation of full featured mongo prototype (that leads to many errors for example because _id is not an string)
            promise.lean()
            // this will return a real promise, thus improving stack traces
            // promise.exec()
        }

        const result = isMongooseQuery ? await promise as any : promise

        if (paginationData) result._paginationData = paginationData

        // EVENTS
        if (!ctx.simulateRequest) {
            const eventName = `${modelName}.${method}.after` // user.create.after

            let newCtx: Ctx
            if (method === 'create') {
                newCtx = ctx.clone({ ...localConfig, method, inputFields, createdId: ressourceId }) satisfies CreateEventAfterCtx<any>
            } else if (method === 'update') {
                if (!localConfig.ressourceId && event.registeredEvents[eventName] && event.registeredEvents[eventName].length) {
                    throw ctx.error.serverError(`An event is registered on this request. When updating all, please use 'disableEmittingEvents' in request config, so that you make sure event emitting is bypassed. Actually updating all is not compatible with event emitting, because you wont get the id of the updated field`)
                }
                newCtx = ctx.clone({ ...localConfig, method, updatedId: ressourceId, inputFields }) satisfies UpdateEventCtx<any>
            } else if (method === 'getOne' || method === 'getAll') {
                newCtx = ctx.clone({ ...localConfig, method, data: result }) satisfies GetOneEventAfterCtx<any> | GetAllEventAfterCtx<any>
            } else if (method === 'delete') {
                newCtx = ctx.clone({ ...localConfig, method, deletedId: localConfig.filter._id }) satisfies DeleteEventCtx
            } else throw ctx.error.serverError('notExistingMethod', { method })

            await event.emit(eventName, newCtx.GM)
        }

        return result
    } catch (err) {
        // TODO use err instanceof mongoose.Error.ValidationError pattern here
        // https://mongoosejs.com/docs/api/error.html
        // "Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: test.users index: phoneWithPrefix_1 dup key: { phoneWithPrefix: \"+33600112233\" }"
        const { errmsg, name, code } = err
        const { dbId, dbName, modelName, method, ressourceId } = localConfig
        const extraInfs = { dbId, dbName, modelName, method, ressourceId }
        if (code === 11000) {
            catchMongoDbDuplicateError(ctx, errmsg, err, extraInfs)
        } else if (name === 'CastError') {
            throw ctx.error.applicationError('databaseWrongCast', { code: 422, err, ...extraInfs })
        } else {
            throw ctx.error.serverError('databaseError', { err, stack: err.stack, ...extraInfs })
        }
    }
}


export function catchMongoDbDuplicateError(ctx, errmsg, err, extraInf) {
    const value = firstMatch(errmsg, /: "(.*?)"? }/)
    const duplicateKey = firstMatch(errmsg, /index: (.*?)_?\d? dup key/)
    throw ctx.error.duplicateRessource({ duplicateKey, value, err, ...extraInf })
}