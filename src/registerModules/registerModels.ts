
import { error } from '../core.error'
import clientAppConfig from '../cache/green_dot.app.config.cache'
import { registerModel } from '../databases/models'

let registered = false

export async function registerModels() {
  if (registered) return // allow calling this function twice without worying about models being registered two times
  try {
    registered = true
    const { serverConfig } = clientAppConfig
    const dbConfigs = await serverConfig.dbConfigs()
    //----------------------------------------
    // REGISTER MODELS AND DAO API
    //----------------------------------------
    const defaulDbName = serverConfig.defaultDatabase || Object.keys(dbConfigs)[0]
    const defaultDb = dbConfigs?.[defaulDbName]

    if (!defaultDb) error.serverError(null, `Could not find DB to load. Please check 'coreBackendConfig.dbConfig' or 'coreBackendConfig.defaultDatabase' in appConfig.ts`, { defaultDb: serverConfig.defaultDatabase, registeredDatabases: Object.keys(dbConfigs) })

    // REGISTER OTHER DBS
    // /!\ known issue: when there are models with duplicate names
    // only the first will be registered
    for (const [dbName, db] of Object.entries(dbConfigs)) {
      for (const dbConfig of Object.values(db)) {
        for (const [modelName, { model }] of Object.entries(dbConfig.models)) {
          registerModel('mongo', dbName, modelName, model)
        }
      }
    }

  } catch (err) {
    error.serverError(null, 'Error while registering models', { err })
  }
}
