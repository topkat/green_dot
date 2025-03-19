
import mongoose from 'mongoose'

export type GreenDotDbConfig = {
  type: 'mongo',
  name: string,
  // name: string // No need, we will take the name of the folder
  /** Here you can instantiate one or multiple versions of the same database with the same models */
  dbs: DbConfigsObj
}

export type DbConfigsObj = {
  connexionString: string | { readonly [instanceName: string]: string }
  mongooseOptions?: mongoose.ConnectOptions
}