

import { AllModelsWithReadWrite, DbIds, MainDbName } from './cache/dbs/index.generated'
import { throwError } from './core.error'
import { getMainConfig, getDbConfigs } from './helpers/getGreenDotConfigs'
import { DaoMethodsMongo } from './databases/mongo/types/mongoDaoTypes'
import { ModelAdditionalFields, ModelsConfigCache, mongoInitDb } from './databases/mongo/initMongoDb'
import { _, Definition, ModelReadWrite } from 'good-cop'
import { C, objEntries, timeout } from 'topkat-utils'
import { getProjectDatabaseDaosForDbName, getProjectDatabaseModelsForDbName } from './helpers/getProjectModelsAndDaos'

import { GD_serverBlacklistModel } from './security/userAndConnexion/GD_serverBlackList.model'
import { convertRoleToPermsToModelFields } from './security/helpers/convertPermsToModelFields'
import { dbIdsToDbNames } from './databases/dbIdsToDbNames'


//  ══╦══ ╦   ╦ ╔══╗ ╔══╗ ╔═══
//    ║   ╚═╦═╝ ╠══╝ ╠═   ╚══╗
//    ╩     ╩   ╩    ╚══╝ ═══╝
//
// Types needs are computed appart from logic in this case

export type Dbs = {
  [K in keyof AllModelsWithReadWrite]: {
    [L in keyof AllModelsWithReadWrite[K]]: AllModelsWithReadWrite[K][L] extends ModelReadWrite ? DaoMethodsMongo<AllModelsWithReadWrite[K][L]> : never
  } & ModelAdditionalFields
} & {
  [k in MainDbName]: {
    // we also inject models created by green_dot
    GD_serverBlacklistModel: DaoMethodsMongo<{ Read: typeof GD_serverBlacklistModel.tsTypeRead, Write: typeof GD_serverBlacklistModel.tsTypeWrite }>
  }
}

export type Db = Dbs[MainDbName]

type AllDbIds = DbIds[keyof DbIds]


//  ═╦═ ╦╗ ╔ ═╦═ ══╦══   ╔═╗  ╔═╗  ╔═══
//   ║  ║╚╗║  ║    ║     ║  ║ ╠═╩╗ ╚══╗
//  ═╩═ ╩ ╚╩ ═╩═   ╩     ╚══╝ ╚══╝ ═══╝

let isRunning = false
let userPermissionFields = [] as (keyof UserPermissionFields)[]

export async function initDbs(resetCache: boolean = false) {

  if (isRunning) {
    await timeout(2000)
    return C.warning(false, 'initDbCore() is called twice while in progress of being initiated')
  } else isRunning = true

  const dbConfigs = getDbConfigs()
  const mainConfigs = getMainConfig()
  let hasDefaultDatabase = false

  for (const { dbs: connexionConfigs, name: dbName, type } of dbConfigs) {

    const models = await getProjectDatabaseModelsForDbName(dbName, resetCache)
    const daos = await getProjectDatabaseDaosForDbName(dbName, resetCache)

    if (mainConfigs.defaultDatabaseName === dbName) {
      // DEFAULT DATABASE
      hasDefaultDatabase = true

      // inject permissions fields in user
      const permissionsFields = {
        ...mainConfigs.allPermissions.reduce((obj, perm) => ({ ...obj, [perm]: _.boolean().default(false) }), {}),
        ...convertRoleToPermsToModelFields(mainConfigs.allRoles)
      }
      userPermissionFields = Object.keys(permissionsFields) as any

      if (!models.user) {
        // we inject a user model
        models.user = _.mongoModel(['creationDate', 'lastUpdateDate'], permissionsFields) as any as Definition
      } else {
        const objDef = (models.user as Definition)._definitions.find(def => def.name === 'object')
        if (typeof objDef !== 'function') Object.assign(objDef.objectCache, permissionsFields)
      }

      // we inject greenDotModels
      models.GD_serverBlackList = GD_serverBlacklistModel as any as Definition

    }

    if (type === 'mongo') {
      //----------------------------------------
      // DATABASES INITIALISATION
      //----------------------------------------
      for (const [databaseId, connectionConfig] of objEntries(connexionConfigs)) {

        dbIdsToDbNames[databaseId] = dbName

        if (cache?.[databaseId].dbConfigs) continue // even when clearing cache, you don't want to reinit projects

        if (type === 'mongo') {
          await mongoInitDb<AllDbIds>(
            dbName,
            databaseId,
            cache,
            connectionConfig,
            daos,
            models as any
          )
        } else throw new Error(`Unknown dbType ${type}`)
      }
    } else {
      throwError.serverError(`Database type not implemented: ${type}`, { dbName: dbName, dbType: type })
    }
  }

  if (!hasDefaultDatabase) throw throwError.serverError(`No default database found with name ${mainConfigs.defaultDatabaseName}. Available names: ${dbConfigs.map(d => d.name)}`)

  isRunning = false
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
    if (!cache[prop]) throw C.error(false, 'DB not initialized, run "await initDb()" once before calling getDb()')
    return cache[prop]
  },
})

export const db = new Proxy({} as Db, {
  // we also use proxy here for we can use getGreenDotConfigSync() without instanciating it
  // once in the file and thus wait until db and cache are operational
  // In short we make sync out of async (more DX friendly at usage)
  get(_, prop: string) {
    const { defaultDatabaseName } = getMainConfig()
    console.log('cache', defaultDatabaseName, JSON.stringify(Object.keys(cache), null, 2))
    return cache[defaultDatabaseName][prop]
  },
})

export function getUserPermissionFields() {
  return userPermissionFields
}

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