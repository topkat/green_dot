
import Path from 'path'
import { AllModels, DbIds, MainDbName } from './cache/dbs/index.generated'
import { getDbCore, initDbCore } from './databases/initCoreDb'
import { getGreenDotPaths } from './generate/generateGreenDotPaths'
import { GreenDotDbConfig } from './types/greenDotDbConfig.types'
import { asArray, C, objEntries } from 'topkat-utils'
import { error } from './core.error'
import { getGreenDotConfig, getGreenDotDbConfigs } from './databases/helpers/getGreenDotConfigs'
import { DaoMethodsMongo } from './databases/mongo/types/mongoDaoTypes'
import { ModelAdditionalFields } from './databases/mongo/initMongoDb'
import { Definition, ModelReadWrite, GenericDef } from 'good-cop'
import { MongoDao, MongoDaoParsed } from './databases/mongo/types/mongoDbTypes'


//  ══╦══ ╦   ╦ ╔══╗ ╔══╗ ╔═══
//    ║   ╚═╦═╝ ╠══╝ ╠═   ╚══╗
//    ╩     ╩   ╩    ╚══╝ ═══╝
//
// Types needs to be computed appart from logic here

type DbType = {
  [K in keyof AllModels]: {
    [L in keyof AllModels[K]]: AllModels[K][L] extends ModelReadWrite ? DaoMethodsMongo<AllModels[K][L]> : never
  }
}

//  ═╦═ ╦╗ ╔ ═╦═ ══╦══   ╔═╗  ╔═╗ 
//   ║  ║╚╗║  ║    ║     ║  ║ ╠═╩╗
//  ═╩═ ╩ ╚╩ ═╩═   ╩     ╚══╝ ╚══╝

/** Used to cache instantiated dbs */
const dbCache = {}

export async function initDb(resetCache: boolean = false) {

  const dbConfigs = await getGreenDotDbConfigs(resetCache)

  for (const { dbs, name, type, folderPath } of dbConfigs) {

    const index = await import(Path.join(folderPath)) as {
      models: { [modelName: string]: Definition }
      daos: Record<string, MongoDaoParsed<any> | MongoDao<any>>
    }

    if (type === 'mongo') {

      await initDbCore<DbIds[keyof DbIds]>(
        'mongo',
        name,
        dbs,
        index.models,
        index.daos,
        resetCache
      )

      // for (const db of asArray(dbs)) {
      //   const { connexionString, name: dbId, mongooseOptions } = db


    } else error.serverError(null, `Database type not implemented: ${type}`, { dbName: name, dbType: type })

  }
}





// INIT DB IN CACHE
const dbConfigs = {} as Record<string, Awaited<ReturnType<typeof initDbCore>>['dbConfigs']>

// initDbCache(bangkDbIds, websiteDbIds, adminDbIds)

async function initDbs() {

  // TODO import config file

  for (const initDbFn of initDbFns) {
    const db = await initDbFn()
    for (const [dbName, dbVal] of Object.entries(db.dbs)) {
      Object.assign(dbCache[dbName], dbVal) // important since we dont want to loose object reference which will lead to bugs
    }
    dbConfigs[db.dbName] = db.dbConfigs
  }





  for (const dbName of dbNames) {
    if (/[ -,.]/.test(mainName)) allCoreErrors.serverError(null, 'Db name should be camelCase')

    const initDb = async (resetCache = false) => 

    const getDb = () => getDbCore<AllModels, DbIds, 'mongo', MainName>(mainName)

      const dbIds = objKeys(getMongoConfigs())
    }


  }
}



// type DbType = Intersection<DbTypesObj[keyof DbTypesObj]>

/** Use that has the main DB entry point of the app */
export const db: DbType = new Proxy({}, {
  // proxy pattern here is a workaround to ensure user always get the latest db cache version
  // on server start, we need to await initDb to ensure the cache always has a value and can 
  // be called anywhere in the app
  get(_, prop) {
    if (Object.keys(dbCache).length === 0) throw C.error('DB not initialized, run "await initDb()" once before calling getDb()')
    else return dbCache[prop]
  },
}) as any


