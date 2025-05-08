

import { getDbConfigs } from './getGreenDotConfigs'
import { Definition } from 'good-cop'
import { MongoDao, MongoDaoParsed } from '../databases/mongo/types/mongoDbTypes'
import { C, objEntries } from 'topkat-utils'
import { safeImport } from './safeImports'
import { parseDaos } from '../databases/parseDaos'
import { error } from '../error'
import defaultDaoConfigMongo from '../databases/mongo/defaultDaoConfigMongo'

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
    console.log(`generatedIndexPath`, process.env.GREEN_DOT_INPUT_COMMAND)
    const fileContent = await safeImport(generatedIndexPath) as DatabaseIndexFileContent
    console.log(`dbName`, dbName)
    modelsCache[dbName] = objEntries(fileContent.models).reduce((obj, [modelName, content]) => ({ ...obj, [modelName.replace(/Model$/, '')]: content }), {})
    console.log(`Object.keys(modelsCache[dbName])`, Object.keys(modelsCache[dbName]))
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
  console.log('Object.keys(modelsCache)', JSON.stringify(Object.keys(modelsCache?.bangk), null, 2))
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

export async function getProjectDatabaseDaosForModel(dbName: string, modelName: string, resetCache = false) {
  await initProjectAndDaosCache(resetCache)
  const daos = daosCache[dbName]
  if (!daos) throw error.serverError(`No Dao model with name ${dbName} found in configs. Available names: ${Object.keys(daosCache)}`)
  if (!daos[modelName] && !modelName.startsWith('GD_')) C.warning(false, `No Dao file set for model ${modelName}. Using default Dao.`)
  return daos[modelName] || defaultDaoConfigMongo
}

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

type DatabaseIndexFileContent = {
  models: { [modelName: string]: Definition }
  daos: { [modelName: string]: MongoDaoParsed<any> | MongoDao<any> }
  defaultDao?: MongoDaoParsed<any> | MongoDao<any>
}