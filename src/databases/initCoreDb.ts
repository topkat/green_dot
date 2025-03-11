
import { GenericDef } from 'good-cop/backend'

import { mongoInitDb } from './mongo/initMongoDb'
import { MongoDao, MongoDaoParsed } from './mongo/types/mongoDbTypes'
import { registerModel } from './models'

import { timeout } from 'topkat-utils'
import { getDaoParsed } from './getDaoParsed'
import { DbConfigs } from '../types/greenDotDbConfig.types'
import { Definition } from 'good-cop'

type DbTypes = 'mongo'


//  ╔══╗ ╔══╗ ╔══╗ ╦  ╦ ╔══╗   ╦  ╦ ╔══╗ ╦╗ ╔ ╔═╗  ╦    ═╦═ ╦╗ ╔ ╔══╗
//  ║    ╠══╣ ║    ╠══╣ ╠═     ╠══╣ ╠══╣ ║╚╗║ ║  ║ ║     ║  ║╚╗║ ║ ═╦
//  ╚══╝ ╩  ╩ ╚══╝ ╩  ╩ ╚══╝   ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ╚══╝ ═╩═ ╩ ╚╩ ╚══╝
const cacheInitializedState: { [dbName: string]: 'notInitialized' | 'inProgress' | 'initialized' } = {}

export type DbCacheType<AllModels extends Record<string, any>, DbNames extends string, DbType extends DbTypes, MainName extends string> = Awaited<ReturnType<typeof initDbCore<AllModels, DbNames, DbType, MainName>>>

const cache = {} as { [dbName: string]: DbCacheType<any, any, any, any> }


export function getDbCore<AllModels extends Record<string, any>, DbNames extends string, DbType extends DbTypes, MainName extends string>(dbName: string) {
    return cache[dbName] as DbCacheType<AllModels, DbNames, DbType, MainName>
}

//  ═╦═ ╦╗ ╔ ═╦═ ══╦══   ╔═╗  ╔═╗    ╔══╗ ╔══╗ ╔══╗ ╔══╗
//   ║  ║╚╗║  ║    ║     ║  ║ ╠═╩╗   ║    ║  ║ ╠═╦╝ ╠═
//  ═╩═ ╩ ╚╩ ═╩═   ╩     ╚══╝ ╚══╝   ╚══╝ ╚══╝ ╩ ╚  ╚══╝
export async function initDbCore<
    DbNames extends string
>(
    dbType: DbTypes,
    dbName: string,
    connexionConfigs: DbConfigs<DbNames>,
    modelsGenerated: { [modelName: string]: Definition<any, any, "def", "def", false> },
    daoConfigsGeneratedRaw: Record<string, MongoDaoParsed<any> | MongoDao<any>>,
    forceRefreshCache = false
) {

    //----------------------------------------
    // CACHE HANDLING
    //- - - - - - - - - - - - - - - - - - - -
    // Cache is here to prevent a database initializing twice, and to
    // refresh database initialization if needed, for example
    // to take in account new DBs that may have been created since last
    // server start
    //----------------------------------------
    if (!cacheInitializedState[dbName]) cacheInitializedState[dbName] = 'notInitialized'
    else if (cacheInitializedState[dbName] === 'initialized' && forceRefreshCache === false) {
        return cache[dbName]
    } else if (cacheInitializedState[dbName] === 'inProgress') {
        await timeout(2000)
        return cache[dbName]
    }

    cacheInitializedState[dbName] = 'inProgress'

    //----------------------------------------
    // SET DEFAULT VALUES
    //----------------------------------------
    const modelConfig = {
        dbName,
        dbConfigs: {},
        dbs: {},
    }


    const daoConfigsParsed = getDaoParsed(daoConfigsGeneratedRaw)

    for (const modelName in modelsGenerated) {
        registerModel(dbType, dbName, modelName, modelsGenerated[modelName], daoConfigsParsed[modelName])
    }

    //----------------------------------------
    // DATABASES INITIALISATION
    //----------------------------------------
    for (const [databaseId, connectionConfig] of Object.entries(connexionConfigs)) {
        if (cache?.dbConfigs?.[databaseId]) continue // even when clearing cache, you don't want to reinit projects
        // the above are typed as any because of this =>
        // https://stackoverflow.com/questions/76775051/why-generic-type-t-extends-a-b-is-not-resolved-correctly-when-in-a-condi/76775364#76775364
        if (dbType === 'mongo') {
            await mongoInitDb<DbNames>(
                dbName,
                databaseId,
                modelConfig as any,
                connectionConfig as any,
                daoConfigsParsed as any,
                modelsGenerated
            )
        } else throw new Error(`Unknown dbType ${dbType}`)

        if (typeof modelConfig.dbConfigs[databaseId] === 'undefined') modelConfig.dbConfigs[databaseId] = {}
    }

    cache[dbName] = modelConfig as any
    cacheInitializedState[dbName] = 'initialized'

    return modelConfig
}


//----------------------------------------
// HELPERS
//----------------------------------------


//----------------------------------------
// TYPES
//----------------------------------------

// type InitDbReturnType<AllModels extends Record<any, any>, DbNames extends string, MainName extends string> = InitDbReturnTypeMongo<AllModels, DbNames, MainName>
