
import mongoose from 'mongoose'
import { error } from '../../core.error'
import { mongoCreateDao } from './mongoCreateDao'

import { MongoDbConfigModels, MongoDbConfig, Definition, DbConfigsObj } from '../../types/core.types'
import { MongoDaoParsed, DaoMethodsMongo } from './types/mongoDbTypes'

import { C, ENV, objEntries } from 'topkat-utils'

const { NODE_ENV } = ENV()
const env: Env = NODE_ENV

type ErrParams = Parameters<typeof error.serverError>

export type ModelAdditionalFields = {
    /** Will init a mongoose session and start a mongo transaction, the session is then stored in the ctx
    so all next DB calls are automatically using the transaction. So you'll have nothing to do except ending
    the transaction, which will trigger an admin alert if not closed for 30 seconds
    * * Make sure you await it
    */
    startTransaction(ctx: Ctx): Promise<void>, // mongoose.mongo.ClientSession could be returned but it's of no use and can be misleading
    /** You have to call it after starting a transaction whenever the transaction is success or
    in a try / catch block to undo the transaction
    * * The endTransaction will take care of transactionCommit() or transactionAbort() depending on the status
    * * Make sure you await it
    */
    endTransaction(ctx: Ctx, status: 'success'): Promise<void>,
    endTransaction(ctx: Ctx, status: 'error', errMsg: ErrParams[0], errOptions: ErrParams[1]): Promise<void>,
    endTransaction(ctx: Ctx, status: 'error', errMsg: false): Promise<void>,
    mongooseConnection: mongoose.Connection
    mongooseModels: { [modelNames: string]: mongoose.Model<any> }
}



export type ModelsConfigCache<AllModels extends Record<string, any> = any> = {
    [dbId: string]: {
        db: {
            [ModelName in keyof AllModels]: DaoMethodsMongo<AllModels[ModelName]>
        } & ModelAdditionalFields
        dbConfigs: MongoDbConfig
    }
}



export async function mongoInitDb<DbIds extends string>(
    dbName: string,
    dbId: string,
    modelsConfigCache: ModelsConfigCache,
    connectionConfig: Omit<DbConfigsObj, 'connexionString'> & { connexionString: string },
    daoConfigsParsed: { [k: string]: MongoDaoParsed<any> },
    modelsGenerated: { [modelName: string]: Definition<any, 'def', 'def', false> }
) {

    const { connexionString, mongooseOptions = {} } = connectionConfig


    const isLocalDb = connexionString.includes('127.0.0.1') || connexionString.includes('localhost')
    const hasNoReplicaSet = isLocalDb && !connexionString.includes('replicaSet')

    //----------------------------------------
    // MONGO SETUP AND CONNEXION
    //----------------------------------------

    mongooseOptions.connectTimeoutMS ??= env !== 'production' && env !== 'preprod' ? env === 'build' ? 2147483647 : 30000 : 1000 * 60 * 7 // avoid error when setting a breakpoint
    const mongooseConnection = mongoose.createConnection(connexionString, mongooseOptions)

    mongooseConnection.on('error', err => {
        if (env !== 'build') error.serverError(`mongoDatabaseConnexionError`, { err, dbId, dbName })
    })
    mongooseConnection.on('connected', () => {
        C.log(C.primary(`✓ DB connected: ${dbId} > ${connexionString.includes('127.0.0') ? 'localhost' : connexionString?.split('@')?.[1]}${connexionString.replace(/^.*(\/[^/]+)$/, '$1').replace(/\?[^?]+$/, '')}`))
    })

    const schemas = {} as { [k in DbIds]: mongoose.Schema }
    const mongooseModels = {} as { [k in DbIds]: mongoose.Model<any> }
    const typedDatabase = {} as { [k in DbIds]: Awaited<ReturnType<typeof mongoCreateDao>> }
    const dbConfs: MongoDbConfigModels = {}

    for (const [modelName, models] of objEntries(modelsGenerated)) {
        //----------------------------------------
        // SETUP SCHEMAS
        //----------------------------------------
        schemas[modelName] = new mongoose.Schema(models._getMongoType())
        if (process.env.NODE_ENV !== 'build') mongooseModels[modelName] = mongooseConnection.model(modelName, schemas[modelName]) as any

        //----------------------------------------
        // BUILD DAO
        //----------------------------------------
        const daoConf = daoConfigsParsed[modelName]
        typedDatabase[modelName] = await mongoCreateDao(mongooseModels[modelName], dbId, dbName, modelName, daoConf)

        //----------------------------------------
        // BUILD DB CONFIGS
        //----------------------------------------
        dbConfs[modelName] = {
            model: modelsGenerated[modelName],
            dao: typedDatabase[modelName],
            daoConfig: daoConfigsParsed[modelName],
        }
    }


    modelsConfigCache[dbId] ??= {} as ModelsConfigCache[string]
    modelsConfigCache[dbId].dbConfigs = {
        dbType: 'mongo',
        models: dbConfs,
        mongooseConnection,
        schemas,
        mongooseModels,
        daoConfigsParsed,
    } satisfies Omit<MongoDbConfig, 'modelTypeFile'>

    const modelAdditionalFields: ModelAdditionalFields = {
        startTransaction: async ctx => {
            if (hasNoReplicaSet) {
                if (ctx.env !== 'development') {
                    throw ctx.error.serverError('cannotRunAtransactionWithNoReplicaSetInDatabase')
                } else {
                    return C.warning('!!WARNING!! ReplicaSet not activated. Please use `run-rs -v 4.0.0 --shell -h 127.0.0.1` to start the database in local')
                }
            }
            if (ctx.transactionSession) throw ctx.error.serverError('mongooseTransactionAlreadyInProgressWithSameCtx')
            const session = await mongooseConnection.startSession()
            ctx.transactionSession = session
            setTimeout(() => {
                // if a transaction is taking too much time to process, we alert the administrators
                // we don't throw since it's probably a sensitive operation in progress and we don't
                // want to mess it up
                if (ctx.transactionSession) ctx.error.serverError('mongooseTransactionTimeout')
            }, 30 * 1000)
            await session.startTransaction()
        },
        endTransaction: async (ctx, status = 'success', ...params) => {
            if (!ctx.transactionSession) {
                throw ctx.error.serverError('mongooseTransactionNotStarted', { additionalInfos: `This can be because you ended transaction twice (if you are in a try catch check that you don't have ended in the body and in the catch clause` })
            }
            const session = ctx.transactionSession
            delete ctx.transactionSession
            if (hasNoReplicaSet) return
            if (status === 'error') {
                await session.abortTransaction()
                await session.endSession()
                const [errMsg, errOptions = {}] = params as ErrParams
                throw ctx.error.serverError(errMsg, errOptions)
            } else {
                await session.commitTransaction()
                await session.endSession()
            }
        },
        mongooseConnection,
        mongooseModels,
    }

    modelsConfigCache[dbId].db = {
        ...typedDatabase,
        ...modelAdditionalFields,
    }
}