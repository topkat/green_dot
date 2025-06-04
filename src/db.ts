

import type { ModelsWithDbNamesAndReadWrite, MainDbName, AllDbIds, DbIds } from './cache/dbs/index.generated'
import { error } from './error'
import { getMainConfig, getDbConfigs } from './helpers/getGreenDotConfigs'
import { DaoMethodsMongo } from './databases/mongo/types/mongoDaoTypes'
import { ModelAdditionalFields, ModelsConfigCache, mongoInitDb } from './databases/mongo/initMongoDb'
import { DefinitionObjChild, ModelReadWrite } from 'good-cop'
import { C, objEntries, timeout } from 'topkat-utils'
import { getProjectDatabaseDaosForDbName, getProjectDatabaseModelsForDbName } from './helpers/getProjectModelsAndDaos'

import { GD_serverBlacklistModel } from './security/userAndConnexion/GD_serverBlackList.model'
import { GD_deviceModel } from './security/userAndConnexion/GD_device.model'
import { dbIdsToDbNames } from './databases/dbIdsToDbNames'
import { InferTypeRead, InferTypeWrite } from 'good-cop'

type InferTypeRW<T extends DefinitionObjChild> = { Read: InferTypeRead<T>, Write: InferTypeWrite<T> }

//  ╔══╗ ╔══╗ ╔══╗ ╦  ╦ ╔══╗
//  ║    ╠══╣ ║    ╠══╣ ╠═
//  ╚══╝ ╩  ╩ ╚══╝ ╩  ╩ ╚══╝
//
//----------------------------------------
// CACHE HANDLING
//- - - - - - - - - - - - - - - - - - - -
// Cache is here to prevent a database initializing twice, and to
// refresh database initialization if needed, for example
// to take in account new DBs that may have been created since last
// server start
//----------------------------------------
export const dbCache = {} as ModelsConfigCache

//  ══╦══ ╦   ╦ ╔══╗ ╔══╗ ╔═══
//    ║   ╚═╦═╝ ╠══╝ ╠═   ╚══╗
//    ╩     ╩   ╩    ╚══╝ ═══╝
//
// Types needs are computed appart from logic in this case

export type Dbs = {
  [K in keyof ModelsWithDbNamesAndReadWrite]: {
    [L in keyof ModelsWithDbNamesAndReadWrite[K]]:
    L extends 'GD_serverBlackList' ? DaoMethodsMongo<InferTypeRW<typeof GD_serverBlacklistModel>> :
    L extends 'GD_device' ? DaoMethodsMongo<InferTypeRW<typeof GD_deviceModel>> :
    ModelsWithDbNamesAndReadWrite[K][L] extends ModelReadWrite ? DaoMethodsMongo<ModelsWithDbNamesAndReadWrite[K][L]> : never
  } & ModelAdditionalFields
}

export type Db = Dbs[MainDbName]


//  ═╦═ ╦╗ ╔ ═╦═ ══╦══   ╔═╗  ╔═╗  ╔═══
//   ║  ║╚╗║  ║    ║     ║  ║ ╠═╩╗ ╚══╗
//  ═╩═ ╩ ╚╩ ═╩═   ╩     ╚══╝ ╚══╝ ═══╝

let isRunning = false


export async function initDbs(resetCache: boolean = false) {

  if (isRunning) {
    await timeout(2000)
    return C.warning(false, 'initDbCore() is called twice while in progress of being initiated')
  } else isRunning = true

  const dbConfigs = getDbConfigs()

  for (const { dbs: connexionConfigs, name: dbName, type } of dbConfigs) {

    const models = await getProjectDatabaseModelsForDbName(dbName, resetCache)
    const daos = await getProjectDatabaseDaosForDbName(dbName, resetCache)


    if (type === 'mongo') {
      //----------------------------------------
      // DATABASES INITIALISATION
      //----------------------------------------
      const { connexionString, ...conf } = connexionConfigs

      const connexionObj = typeof connexionString === 'string' ? { [dbName]: connexionString } : connexionString

      for (const [dbId, mongoConStr] of objEntries(connexionObj)) {

        dbIdsToDbNames[dbId] = dbName

        if (dbCache?.[dbId]?.dbConfigs) continue // even when clearing cache, you don't want to reinit projects

        await mongoInitDb(
          dbName as keyof DbIds,
          dbId as AllDbIds,
          dbCache,
          { ...conf, connexionString: mongoConStr },
          daos,
          models
        )
      }
    } else {
      throw error.serverError(`Database type not implemented: ${type}. Please make sure you provided gd.config.ts a defaultDatabase`, { dbName: dbName, dbType: type })
    }
  }

  isRunning = false

  C.log(C.primary(`✓ DB Initialized`))
}


//  ╔═╗  ╔═╗
//  ║  ║ ╠═╩╗
//  ╚══╝ ╚══╝

/** Use that in your backend app has the main DB entry point of any database operations.
 * @example ```db.myDbName.myModelName.count(ctx, { status: 'success' })```
 */
export const dbs = new Proxy({} as Dbs, {
  // proxy pattern here is a workaround to ensure user always get the latest db cache version
  // on server start, we need to await initDb to ensure the cache always has a value and can
  // be called anywhere in the app
  get(_, prop: string) {
    if (!dbCache[prop]?.db) throw C.error('DBs not initialized, run "await initDb()" once before calling getDb()')
    return dbCache[prop].db
  },
})

export const db = new Proxy({} as Db, {
  // we also use proxy here for we can use getGreenDotConfigSync() without instanciating it
  // once in the file and thus wait until db and cache are operational
  // In short we make sync out of async (more DX friendly at usage)
  get(_, prop: string) {
    const { defaultDatabaseName } = getMainConfig()
    if (!dbCache[defaultDatabaseName]?.db) throw C.error('DB not initialized, run "await initDb()" once before calling getDb()')
    if (!dbCache[defaultDatabaseName]?.db?.[prop]) throw C.error(`Model ${prop} doesn't seem to be properly initialized and is not defined in modelsCache`)
    return dbCache[defaultDatabaseName].db[prop]
  },
})



/** This mean to exist for performances reason to avoid initiating two databases when there is two execution contexts (the client app / the green_dot module), TODO In Progress not fully tested / implemented */
export function updateCacheFromOutside(cache2: ModelsConfigCache) {
  Object.assign(dbCache, cache2)
}
