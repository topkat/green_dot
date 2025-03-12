
import Path from 'path'
import { AllModels, DbIds } from './cache/dbs/index.generated'
import { error } from './core.error'
import { getGreenDotDbConfigs } from './databases/helpers/getGreenDotConfigs'
import { DaoMethodsMongo } from './databases/mongo/types/mongoDaoTypes'
import { ModelAdditionalFields, ModelsConfigCache, mongoInitDb } from './databases/mongo/initMongoDb'
import { Definition, ModelReadWrite } from 'good-cop'
import { MongoDao, MongoDaoParsed } from './databases/mongo/types/mongoDbTypes'
import { C, objEntries, timeout } from 'topkat-utils'
import { getDaoParsed } from './databases/getDaoParsed'
import { registerModel } from './databases/models'


//  ══╦══ ╦   ╦ ╔══╗ ╔══╗ ╔═══
//    ║   ╚═╦═╝ ╠══╝ ╠═   ╚══╗
//    ╩     ╩   ╩    ╚══╝ ═══╝
//
// Types needs are computed appart from logic in this case

type DbType = {
  [K in keyof AllModels]: {
    [L in keyof AllModels[K]]: AllModels[K][L] extends ModelReadWrite ? DaoMethodsMongo<AllModels[K][L]> : never
  } & ModelAdditionalFields
}

type AllDbIds = DbIds[keyof DbIds]


//  ═╦═ ╦╗ ╔ ═╦═ ══╦══   ╔═╗  ╔═╗  ╔═══
//   ║  ║╚╗║  ║    ║     ║  ║ ╠═╩╗ ╚══╗
//  ═╩═ ╩ ╚╩ ═╩═   ╩     ╚══╝ ╚══╝ ═══╝

let isRunning = false

export async function initDbs(resetCache: boolean = false) {

  if (isRunning) {
    await timeout(2000)
    return C.warning(false, 'initDbCore() is called twice while in progress of being initiated')
  } else isRunning = true

  const dbConfigs = await getGreenDotDbConfigs(resetCache)

  for (const { dbs: connexionConfigs, name, type, folderPath } of dbConfigs) {

    const { models, daos } = await import(Path.join(folderPath)) as {
      models: { [modelName in AllDbIds]: Definition }
      daos: Record<string, MongoDaoParsed<any> | MongoDao<any>>
    }

    if (type === 'mongo') {

      const daoConfigsParsed = getDaoParsed(daos)

      for (const modelName in models) {
        registerModel(type, name, modelName, models[modelName] as any, daoConfigsParsed[modelName])
      }

      //----------------------------------------
      // DATABASES INITIALISATION
      //----------------------------------------
      for (const [databaseId, connectionConfig] of objEntries(connexionConfigs)) {

        if (cache?.[databaseId].dbConfigs) continue // even when clearing cache, you don't want to reinit projects

        if (type === 'mongo') {
          await mongoInitDb<AllDbIds>(
            name,
            databaseId,
            cache,
            connectionConfig,
            daoConfigsParsed,
            models as any
          )
        } else throw new Error(`Unknown dbType ${type}`)

        if (typeof cache[databaseId]?.dbConfigs === 'undefined') C.error(false, 'WHY THAT ?!?' + `modelConfig.dbConfigs[${databaseId}] not set TODO DELETEME if no error is triggered`)
      }
    } else error.serverError(null, `Database type not implemented: ${type}`, { dbName: name, dbType: type })
  }

  isRunning = false
}


//  ╔═╗  ╔═╗ 
//  ║  ║ ╠═╩╗
//  ╚══╝ ╚══╝

/** Use that in your backend app has the main DB entry point of any database operations.
 * @example ```db.myDbName.myModelName.count(ctx, { status: 'success' })```
 */
export const db = new Proxy({} as DbType, {
  // proxy pattern here is a workaround to ensure user always get the latest db cache version
  // on server start, we need to await initDb to ensure the cache always has a value and can 
  // be called anywhere in the app
  get(_, prop: string) {
    if (!cache[prop]) throw C.error(false, 'DB not initialized, run "await initDb()" once before calling getDb()')
    return cache[prop]
  },
})

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
const cache = {} as ModelsConfigCache

