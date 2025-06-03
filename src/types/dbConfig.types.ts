
import mongoose from 'mongoose'

export type GreenDotDbConfig = {
  type: 'mongo',
  name: string,
  /** Here you can instantiate one or multiple versions of the same database with the same models. Use it like `{ connexionString: string }` OR `{ connexionString: { dbInstanceName1: connexionString, dbInstance2...} }`. The second use case works well if you have a database per client for example */
  dbs: DbConfigsObj
}

export type DbConfigsObj = {
  connexionString: string | { readonly [instanceName: string]: string }
  mongooseOptions?: mongoose.ConnectOptions
}