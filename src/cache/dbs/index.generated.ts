

export const defaultDbName = 'mainDb'

export type ModelsWithDbNamesAndReadWrite = Record<string, any>

export type DbIds = Record<string, string>

export type AllDbIds = string

export type MainDbName = string

export type ModelsWithReadWrite = Record<string, any>

export type ModelTypes = Record<string, Record<string, any>> // type safety

/** All ModelNames for all DB Names: 'modelName1' | 'modelName2'...  */
export type ModelNames = string

/** ModelNames for DB { [dbName]: 'modelName1' | 'modelName2'... } */
export type ModelNamesForDb = Record<string, string>
