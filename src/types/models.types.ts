

import { DaoMethodsMongo, MongoDaoParsed } from '../databases/mongo/types/mongoDbTypes.js'
import mongoose from 'mongoose'
import { Definition } from '../lib/good-cop/src/index.js'



// TODO Put this if possible in mongoDbType
export type MongoDbConfig = NoExtraProperties<{
  /** One of mongo */
  dbType: 'mongo'
  /** List of model, dao and daoConfig as found in the files (not parsed) */
  models: MongoDbConfigModels
  /** The original mongoose connection object is here */
  mongooseConnection: mongoose.Connection
  /** MongoDb format schema */
  schemas: { [modelNames: string]: mongoose.Schema }
  /** mongoose format models */
  mongooseModels: { [modelNames: string]: mongoose.Model<any> }
  /** DaoConfig == hooks like filter, mask...etc, parsed means that all values are present, no `ALL` is to be found and `notFor` and `notOn` as been transformed to `on` and `for` */
  daoConfigsParsed: { [modelNames: string]: MongoDaoParsed<any>; }
}>

export type MongoDbConfigModels = {
  [modelNames: string]: {
    /** The dao here is the object with methods (getAll, getById...) */
    dao: DaoMethodsMongo<any>
    /** DaoConfig here is the .dao files with hooks like filter, mask/select... */
    daoConfig: MongoDaoParsed<any>
    /** Here is the validation model */
    model: Definition
  }
}

export type ModelReadWrite = {
  Write: Record<string, any>
  Read: Record<string, any>
}


export type DbConfigs = {
  [dbName: string]: {
    [dbId: string]: MongoDbConfig
  }
}

export type MongoDaoParsedObj = {
  [dbId: string]: {
    [modelName: string]: MongoDaoParsed<any>
  }
}