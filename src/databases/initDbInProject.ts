

import { initDbCore } from './initCoreDb'

import { C } from 'topkat-utils'

export const dbCache = {}


//----------------------------------------
// INIT CACHE
//----------------------------------------
/** This is NOT ASYNC and is used to init the DB cache, it may be called from anywhere, even before initializing DB. As initializing DB is async we need this to be popualted beforeAll and in a not async way, THEN we can instanciate DB asynchronously safely */
export function initDbCache<
  DbIds extends Array<readonly string[]>
>(
  ...dbNames: DbIds
) {
  for (const dbName of dbNames.flat()) {
    dbCache[dbName as any] = {}
  }
}

//----------------------------------------
// INIT DBS
//----------------------------------------
/** This one asynchronously init all dbs and create an object of { dbName: dbConfig } */
export async function initDbs<T extends ((resetCache?: boolean) => any)[]>(
  ...initDbFns: T
): Promise<
  {
    [K in Awaited<ReturnType<T[0]>>['dbName']]: Awaited<ReturnType<T[0]>>['dbConfigs']
  } & {
    [K in Awaited<ReturnType<T[1]>>['dbName']]: Awaited<ReturnType<T[1]>>['dbConfigs']
  } & {
    [K in Awaited<ReturnType<T[2]>>['dbName']]: Awaited<ReturnType<T[2]>>['dbConfigs']
  } & {
    [K in Awaited<ReturnType<T[3]>>['dbName']]: Awaited<ReturnType<T[3]>>['dbConfigs']
  } /* 😵‍💫 the only way I found to have perfect typing */
> {
  const dbConfigs = {} as Record<string, Awaited<ReturnType<typeof initDbCore>>['dbConfigs']>
  for (const initDbFn of initDbFns) {
    const db = await initDbFn()
    for (const [dbName, dbVal] of Object.entries(db.dbs)) {
      Object.assign(dbCache[dbName], dbVal) // important since we dont want to loose object reference which will lead to bugs
    }
    dbConfigs[db.dbName] = db.dbConfigs
  }
  return dbConfigs as any
}


//----------------------------------------
// GET CACHE
//----------------------------------------
export function getDbCache<DbType>(): DbType {
  if (Object.keys(dbCache).length === 0) throw C.error('DB not initialized, run getServerConfig() once before calling getDb()')
  else return dbCache as DbType
}