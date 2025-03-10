
import mongoose from 'mongoose'
import { error } from '../../core.error'
import { models } from '../models'
import { mongoCreateDao } from './mongoCreateDao'

import { MongoDbConfigModels, MongoDbConfig, Definition, ModelReadWrite } from '../../types/core.types'
import { MongoConnexionConfigs, MongoDaoParsed, DaoMethodsMongo } from './types/mongoDbTypes'

import { C, ENV } from 'topkat-utils'

const { NODE_ENV } = ENV()
const env: Env = NODE_ENV

type ErrParams = Parameters<typeof error.serverError>

type ModelAdditionalFields = {
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
    endTransaction(ctx: Ctx, status: 'error', errMsg: ErrParams[1], errOptions: ErrParams[2]): Promise<void>,
    endTransaction(ctx: Ctx, status: 'error', errMsg: false): Promise<void>,
    mongooseConnection: mongoose.Connection
}

export type InitDbReturnTypeMongo<
    AllModels extends Record<any, ModelReadWrite>,
    DbNames extends string,
    MainName extends string
> = {
    dbName: MainName
    dbs: {
        [dbName in DbNames]: {
            [ModelName in keyof AllModels]: DaoMethodsMongo<AllModels[ModelName]>
        } & ModelAdditionalFields
    }
    dbConfigs: { [dbName in DbNames]: MongoDbConfig }
}



export async function mongoInitDb<AllModels extends Record<string, any>, DbNames extends string, MainName extends string>(
    dbName: MainName,
    dbId: string,
    modelConfig: InitDbReturnTypeMongo<AllModels, DbNames, MainName>,
    connectionConfig: MongoConnexionConfigs<DbNames>[any],
    daoConfigsParsed: { [k in DbNames]: MongoDaoParsed<any> },
    modelsGenerated: { [modelName: string]: Definition }
) {
    const modelNames = Object.keys(modelsGenerated) as DbNames[]
    const { databaseURL, mongoOptions = {} } = connectionConfig as { firstLevelDb: boolean } & MongoConnexionConfigs<DbNames>[any]
    const isLocalDb = databaseURL.includes('127.0.0.1') || databaseURL.includes('localhost')
    const hasNoReplicaSet = isLocalDb && !databaseURL.includes('replicaSet')

    //----------------------------------------
    // MONGO SETUP AND CONNEXION
    //----------------------------------------

    mongoOptions.connectTimeoutMS ??= env !== 'production' && env !== 'preprod' ? env === 'build' ? 2147483647 : 30000 : 1000 * 60 * 7 // avoid error when setting a breakpoint
    const mongooseConnection = mongoose.createConnection(databaseURL, mongoOptions)

    mongooseConnection.on('error', err => {
        if (env !== 'build') error.serverError(null, `mongoDatabaseConnexionError`, { err, dbId, dbName })
    })
    mongooseConnection.on('connected', () => {
        C.log(C.primary(`✓ DB connected: ${dbName} > ${databaseURL.includes('127.0.0') ? 'localhost' : databaseURL?.split('@')?.[1]}${databaseURL.replace(/^.*(\/[^/]+)$/, '$1').replace(/\?[^?]+$/, '')}`))
    })

    const schemas = {} as { [k in DbNames]: mongoose.Schema }
    const mongooseModels = {} as { [k in DbNames]: mongoose.Model<any> }
    const typedDatabase = {} as { [k in DbNames]: Awaited<ReturnType<typeof mongoCreateDao>> }
    const dbConfs: MongoDbConfigModels = {}

    for (const modelName of modelNames) {
        //----------------------------------------
        // SETUP SCHEMAS
        //----------------------------------------
        delete models.mongo[dbName][modelName]._id // _id field shall not be explicitely set in Schema
        schemas[modelName] = new mongoose.Schema(models.mongo[dbName][modelName])
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



    modelConfig.dbConfigs[dbId] = {
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
                    error.serverError(ctx, 'cannotRunAtransactionWithNoReplicaSetInDatabase')
                } else {
                    return C.warning('!!WARNING!! ReplicaSet not activated. Please use `run-rs -v 4.0.0 --shell -h 127.0.0.1` to start the database in local')
                }
            }
            if (ctx.transactionSession) error.serverError(ctx, 'mongooseTransactionAlreadyInProgressWithSameCtx')
            const session = await mongooseConnection.startSession()
            ctx.transactionSession = session
            setTimeout(() => {
                // if a transaction is taking too much time to process, we alert the administrators
                // we don't throw since it's probably a sensitive operation in progress and we don't
                // want to mess it up
                if (ctx.transactionSession) error.serverError(ctx, 'mongooseTransactionTimeout', { doNotThrow: true })
            }, 30 * 1000)
            await session.startTransaction()
        },
        endTransaction: async (ctx, status = 'success', ...params) => {
            if (!ctx.transactionSession) {
                error.serverError(ctx, 'mongooseTransactionNotStarted', { additionalInfos: `This can be because you ended transaction twice (if you are in a try catch check that you don't have ended in the body and in the catch clause` })
            }
            const session = ctx.transactionSession
            delete ctx.transactionSession
            if (hasNoReplicaSet) return
            if (status === 'error') {
                await session.abortTransaction()
                await session.endSession()
                const [errMsg, errOptions = {}] = params as [ErrParams[1], ErrParams[2]]
                error.serverError(ctx, errMsg, errOptions)
            } else {
                await session.commitTransaction()
                await session.endSession()
            }
        },
        mongooseConnection,
    }

    modelConfig.dbs[dbId] = {
        ...typedDatabase,
        ...modelAdditionalFields,
    }
}