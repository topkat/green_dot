import fs from 'fs-extra'
import Path from 'path'
import { greenDotCacheModuleFolder } from '../../helpers/getProjectPaths.js'
import { C } from 'topkat-utils'


export async function generateDefaultSafeIndexDbCacheFile({
  outputFolder = Path.join(greenDotCacheModuleFolder, 'dbs'),
  outputFileNameWithoutExtension = 'index.generated'
} = {}) {

  // CLEAN FILE
  const indexFileContent = `

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
`


  await fs.outputFile(Path.join(outputFolder, outputFileNameWithoutExtension + '.ts'), indexFileContent)

  if (outputFolder.includes(greenDotCacheModuleFolder)) C.success(`Successfully generated Default SAFE local cache/dbs/index.generated.ts`)

}