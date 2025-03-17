

import Path from 'path'
import fs from 'fs-extra'
import { getDbConfigs, getMainConfig } from '../../helpers/getGreenDotConfigs'
import { C } from 'topkat-utils'
import { greenDotCacheModuleFolder } from '../../helpers/getProjectPaths'




/** If this function is called alone, it will generate a default index file that is typescript valid and safe */
export async function generateIndexForDbCachedFiles(indexFile: ReturnType<typeof getNewIndexForDbCacheFileStructure> = getNewIndexForDbCacheFileStructure()) {

  const mainConfig = getMainConfig()
  const dbConfigs = getDbConfigs()

  const indexFileContent = `
${indexFile.imports}

export type AllModelsWithReadWrite = ${indexFile.allModels.length ? `{
${indexFile.allModels}}`
      : 'Record<string, any>'}

export type DbIds = ${indexFile.dbIds.length ? `{
${indexFile.dbIds}}`
      : 'Record<string, string>'}

export type MainDbName = ${mainConfig && mainConfig.defaultDatabaseName && dbConfigs && dbConfigs.length ? `'${mainConfig.defaultDatabaseName}'` : 'string'}

${indexFile.imports.length ? `
type Result = MergeMultipleObjects<AllModelsWithReadWrite>

/** With this getter you can safely use your model types anywhere (even in db folders).
If you use straight type like \`\`\`User\`\`\`, it may error when you are in a database folder
 * @example \`\`\`type User = ModelTypes['user']\`\`\`
*/
export type ModelTypes = {
    [K in keyof Result]: Result[K]['Read']
} & {
    [K in keyof Result as \`\${K & string}Write\`]: Result[K]['Write']
}

/** All ModelNames for all DB Names: 'modelName1' | 'modelName2'...  */
export type ModelNames = keyof Result

/** ModelNames for DB { [dbName]: 'modelName1' | 'modelName2'... } */
export type ModelNamesForDb = { [K in keyof AllModelsWithReadWrite]: keyof AllModelsWithReadWrite[K] }
`
      : `export type ModelTypes = Record<string, any>
/** All ModelNames for all DB Names: 'modelName1' | 'modelName2'...  */
export type ModelNames = string

/** ModelNames for DB { [dbName]: 'modelName1' | 'modelName2'... } */
export type ModelNamesForDb = Record<string, string>
`}
`

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