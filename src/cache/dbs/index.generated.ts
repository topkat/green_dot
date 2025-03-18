

export type AllModelsWithReadWrite = Record<string, any>

export type DbIds = Record<string, string>

export type MainDbName = string

type AnyObject = { [key: string]: AnyObject } | any

export type ModelTypes = AnyObject

/** All ModelNames for all DB Names: 'modelName1' | 'modelName2'...  */
export type ModelNames = string

/** ModelNames for DB { [dbName]: 'modelName1' | 'modelName2'... } */
export type ModelNamesForDb = Record<string, string>

export { }