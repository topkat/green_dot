

import Path from 'path'
import fs from 'fs-extra'
import { getDbConfigs, getMainConfig } from '../../helpers/getGreenDotConfigs'
import { C } from 'topkat-utils'
import { greenDotCacheModuleFolder } from '../../helpers/getProjectPaths'




/** If this function is called alone, it will generate a default index file that is typescript valid and safe */
export async function generateIndexForDbCachedFiles(
  indexFile?
) {

  let indexFileContent = ''

  if (!indexFile) {
    // CLEAN FILE
    indexFileContent += `

export type ModelsWithDbNamesAndReadWrite = Record<string, any>

export type DbIds = Record<string, string>

export type AllDbIds = string

export type MainDbName = string

export type ModelsWithReadWrite = Record<string, any>

export type ModelTypes = Record<string, Record<string, Record<string, any>>> // type safety

/** All ModelNames for all DB Names: 'modelName1' | 'modelName2'...  */
export type ModelNames = string

/** ModelNames for DB { [dbName]: 'modelName1' | 'modelName2'... } */
export type ModelNamesForDb = Record<string, string>
`
  } else {
    // BUILDED FILE
    const mainConfig = getMainConfig()
    const dbConfigs = getDbConfigs()

    indexFileContent += `
${indexFile.imports}

export type ModelsWithDbNamesAndReadWrite = {
${indexFile.allModels}\
}

export type DbIds = {
${indexFile.dbIds}\
}

export type AllDbIds = DbIds[keyof DbIds]

export type MainDbName = ${mainConfig && mainConfig.defaultDatabaseName && dbConfigs && dbConfigs.length ? `'${mainConfig.defaultDatabaseName}'` : 'string'}

export type ModelsWithReadWrite = MergeMultipleObjects<ModelsWithDbNamesAndReadWrite>

/** With this getter you can safely use your model types anywhere (even in db folders).
If you use straight type like \`\`\`User\`\`\`, it may error when you are in a database folder
 * @example \`\`\`type User = ModelTypes['user']\`\`\`
*/
export type ModelTypes = {
    [K in keyof ModelsWithReadWrite]: ModelsWithReadWrite[K]['Read']
} & {
    [K in keyof ModelsWithReadWrite as \`\${K & string}Write\`]: ModelsWithReadWrite[K]['Write']
}

/** All ModelNames for all DB Names: 'modelName1' | 'modelName2'...  */
export type ModelNames = keyof ModelsWithReadWrite

/** ModelNames for DB { [dbName]: 'modelName1' | 'modelName2'... } */
export type ModelNamesForDb = { [K in keyof ModelsWithDbNamesAndReadWrite]: keyof ModelsWithDbNamesAndReadWrite[K] }
`
  }

  await fs.outputFile(Path.join(greenDotCacheModuleFolder, 'index.generated.ts'), indexFileContent)

  C.success(`Successfully generated local cache/dbs/index.generated.ts`)
}



//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

export function getNewIndexForDbCacheFileStructure() {
  return {
    imports: '',
    allModels: '',
    dbIds: '',
  }
}

export type DbCacheIndexFileStructure = ReturnType<typeof getNewIndexForDbCacheFileStructure>