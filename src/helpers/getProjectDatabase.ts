

import { getDbConfigs } from './getGreenDotConfigs'
import { Definition } from 'good-cop'
import { MongoDao, MongoDaoParsed } from '../databases/mongo/types/mongoDbTypes'
import { C } from 'topkat-utils'
import { safeImport } from './safeImports'
import { parseDaos } from '../databases/parseDaos'


const modelsCache = {} as { [dbName: string]: { [modelName: string]: Definition } }
const daosCache = {} as { [dbName: string]: { [modelName: string]: MongoDaoParsed<any> } }


type DatabaseIndexFileContent = {
  models: { [modelName: string]: Definition }
  daos: { [modelName: string]: MongoDaoParsed<any> | MongoDao<any> }
  defaultDao?: MongoDaoParsed<any> | MongoDao<any>
}

let cacheInitialized = false

async function initCache(resetCache = false) {
  if (cacheInitialized && resetCache === false) return
  cacheInitialized = true
  const dbConfigs = getDbConfigs()
  for (const { generatedIndexPath, name: dbName } of dbConfigs) {
    const fileContent = await safeImport(generatedIndexPath) as DatabaseIndexFileContent

    modelsCache[dbName] = fileContent.models

    daosCache[dbName] = parseDaos(Object.keys(fileContent.models), fileContent.daos, fileContent.defaultDao)
  }
}


// MODELS

export async function getProjectDatabaseModels(resetCache = false) {
  await initCache(resetCache)
  return modelsCache
}

export function getProjectDatabaseModelsSync() {
  initCache() // just in case it didn't run
  return modelsCache
}

export async function getProjectDatabaseModelsForDbName(dbName: string, resetCache = false) {
  await initCache(resetCache)
  const models = modelsCache[dbName]
  if (!models) throw C.error(false, `No database model with name ${dbName} found in configs. Available names: ${Object.keys(modelsCache)}`)
  return models
}

// DAOS

export async function getProjectDatabaseDaos(resetCache = false) {
  await initCache(resetCache)
  return daosCache
}

export async function getProjectDatabaseDaosForDbName(dbName: string, resetCache = false) {
  await initCache(resetCache)
  const daos = daosCache[dbName]
  if (!daos) throw C.error(false, `No Dao model with name ${dbName} found in configs. Available names: ${Object.keys(daosCache)}`)
  return daos
}