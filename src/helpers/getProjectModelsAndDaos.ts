

import { getDbConfigs } from './getGreenDotConfigs'
import { Definition } from 'good-cop'
import { MongoDao, MongoDaoParsed } from '../databases/mongo/types/mongoDbTypes'
import { objEntries } from 'topkat-utils'
import { safeImport } from './safeImports'
import { parseDaos } from '../databases/parseDaos'
import { error } from '../error'

//  ═╦═ ╦╗ ╔ ═╦═ ══╦══
//   ║  ║╚╗║  ║    ║
//  ═╩═ ╩ ╚╩ ═╩═   ╩

let modelsCache: { [dbName: string]: { [modelName: string]: Definition } }
let daosCache: { [dbName: string]: { [modelName: string]: MongoDaoParsed<any> } }

let cacheInitialized = false

export async function initProjectAndDaosCache(resetCache = false) {
  if (cacheInitialized && resetCache === false) return
  modelsCache = {}
  daosCache = {}
  cacheInitialized = true
  const dbConfigs = getDbConfigs()
  for (const { generatedIndexPath, name: dbName } of dbConfigs) {
    const fileContent = await safeImport(generatedIndexPath) as DatabaseIndexFileContent
    modelsCache[dbName] = objEntries(fileContent.models).reduce((obj, [modelName, content]) => ({ ...obj, [modelName.replace(/Model$/, '')]: content }), {})

    const { _defaultDao, ...regularDaos } = fileContent.daos

    daosCache[dbName] = await parseDaos(
      Object.keys(modelsCache[dbName]),
      regularDaos,
      _defaultDao
    )
  }
}


//  ╦╗╔╦ ╔══╗ ╔═╗  ╔══╗ ╦    ╔═══
//  ║╚╝║ ║  ║ ║  ║ ╠═   ║    ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╚══╝ ╚══╝ ═══╝

export async function getProjectDatabaseModels(resetCache = false) {
  await initProjectAndDaosCache(resetCache)
  return modelsCache
}

export function getProjectDatabaseModelsSync() {
  if (!modelsCache) throw error.serverError(`Cache for database has not been initialized, please make sure you run initProjectAndDaosCache() first`)
  return modelsCache
}

export async function getProjectDatabaseModelsForDbName(dbName: string, resetCache = false) {
  await initProjectAndDaosCache(resetCache)
  const models = modelsCache[dbName]
  if (!models) throw error.serverError(`No database model with name ${dbName} found in configs. Available names: ${Object.keys(modelsCache)}`)
  return models
}

//  ╔═╗  ╔══╗ ╔══╗ ╔═══
//  ║  ║ ╠══╣ ║  ║ ╚══╗
//  ╚══╝ ╩  ╩ ╚══╝ ═══╝

export async function getProjectDatabaseDaos(resetCache = false) {
  await initProjectAndDaosCache(resetCache)
  return daosCache
}

export async function getProjectDatabaseDaosForDbName(dbName: string, resetCache = false) {
  await initProjectAndDaosCache(resetCache)
  const daos = daosCache[dbName]
  if (!daos) throw error.serverError(`No Dao model with name ${dbName} found in configs. Available names: ${Object.keys(daosCache)}`)
  return daos
}

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

type DatabaseIndexFileContent = {
  models: { [modelName: string]: Definition }
  daos: { [modelName: string]: MongoDaoParsed<any> | MongoDao<any> }
  defaultDao?: MongoDaoParsed<any> | MongoDao<any>
}