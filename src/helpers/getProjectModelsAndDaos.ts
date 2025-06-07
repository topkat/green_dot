

import { getDbConfigs, getMainConfig } from './getGreenDotConfigs.js'
import { _, Definition, mongoModelFieldsProcessing } from '../lib/good-cop/index-backend.js'
import { MongoDao, MongoDaoParsed } from '../databases/mongo/types/mongoDbTypes.js'
import { C, objEntries } from 'topkat-utils'
import { safeImport } from './safeImports.js'
import { parseDaos } from '../databases/parseDaos.js'
import { error } from '../error.js'
import defaultDaoConfigMongo from '../databases/mongo/defaultDaoConfigMongo.js'
import { getUserDefaultAdditionalFields } from '../security/userAndConnexion/userAdditionalFields.js'
import { convertRoleToPermsToModelFields } from '../security/helpers/convertPermsToModelFields.js'
import { GD_serverBlacklistModel } from '../security/userAndConnexion/GD_serverBlackList.model.js'
import { GD_deviceModel } from '../security/userAndConnexion/GD_device.model.js'
import { getAllPermissions } from './getAllPermissions.js'

//  ═╦═ ╦╗ ╔ ═╦═ ══╦══
//   ║  ║╚╗║  ║    ║
//  ═╩═ ╩ ╚╩ ═╩═   ╩

let modelsCache: { [dbName: string]: { [modelName: string]: Definition } }
let daosCache: { [dbName: string]: { [modelName: string]: MongoDaoParsed<any> } }

let userPermissionFields = [] as (keyof UserPermissionFields)[]

let cacheInitialized = false

export async function initProjectAndDaosCache(resetCache = false) {
  if (cacheInitialized && resetCache === false) return
  modelsCache = {}
  daosCache = {}
  cacheInitialized = true
  let hasDefaultDatabase = false

  const mainConfig = getMainConfig()
  const dbConfigs = getDbConfigs()


  for (const { generatedIndexPath, name: dbName } of dbConfigs) {

    const fileContent = await safeImport(generatedIndexPath) as DatabaseIndexFileContent

    modelsCache[dbName] = objEntries(fileContent.models).reduce((obj, [modelName, content]) => ({ ...obj, [modelName.replace(/Model$/, '')]: content }), {})

    if (mainConfig.defaultDatabaseName === dbName) {
      // DEFAULT DATABASE
      // So we put all technical green_dot fields
      hasDefaultDatabase = true

      const { getPluginAdditionalUserFields } = await import('../plugins/pluginSystem.js')

      // inject permissions fields in user model
      const userAdditionalFields = {
        ...getUserDefaultAdditionalFields(),
        ...getPluginAdditionalUserFields(),
        ...getAllPermissions().reduce((obj, perm) => ({ ...obj, [perm]: _.boolean().default(false) }), {}),
        ...convertRoleToPermsToModelFields(mainConfig.allRoles)
      }
      userPermissionFields = Object.keys(userAdditionalFields) as any

      if (!modelsCache[dbName].user) {
        // we inject a user model
        modelsCache[dbName].user = _.mongoModel(['creationDate', 'lastUpdateDate'], userAdditionalFields) as any as Definition
      } else {
        mongoModelFieldsProcessing(userAdditionalFields)
        const objDef = (modelsCache[dbName].user as Definition)._definitions.find(def => def.name === 'object')
        if (typeof objDef !== 'function') Object.assign(objDef.objectCache, userAdditionalFields)
      }

      // we inject greenDotModels
      modelsCache[dbName].GD_serverBlackList = GD_serverBlacklistModel as any as Definition
      modelsCache[dbName].GD_device = GD_deviceModel as any as Definition

    }

    const { _defaultDao, ...regularDaos } = fileContent.daos

    daosCache[dbName] = await parseDaos(
      Object.keys(modelsCache[dbName]),
      regularDaos,
      _defaultDao
    )
  }

  if (!hasDefaultDatabase) throw error.serverError(`No default database found with name ${mainConfig.defaultDatabaseName}. Available names: ${dbConfigs.map(d => d.name)}`)

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

export function getUserPermissionFields() {
  if (userPermissionFields.length === 0) {
    const mainConfig = getMainConfig()
    const permissionsFields = {
      ...mainConfig.allPermissions.reduce((obj, perm) => ({ ...obj, [perm]: _.boolean().default(false) }), {}),
      ...convertRoleToPermsToModelFields(mainConfig.allRoles)
    }
    userPermissionFields = Object.keys(permissionsFields) as any
  }
  return userPermissionFields
}