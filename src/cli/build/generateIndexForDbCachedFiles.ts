

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

export type AllModels = ${indexFile.allModels.length ? `{
${indexFile.allModels}}`
      : 'Record<string, any>'}

export type DbIds = ${indexFile.dbIds.length ? `{
${indexFile.dbIds}}`
      : 'Record<string, string>'}

export type MainDbName = ${mainConfig && mainConfig.defaultDatabaseName && dbConfigs && dbConfigs.length ? `'${mainConfig.defaultDatabaseName}'` : 'string'}

${indexFile.imports.length ? `
type Result = MergeMultipleObjects<AllModels>

/** With this getter you can safely use your model types anywhere (even in db folders).
If you use straight type like \`\`\`User\`\`\`, it may error when you are in a database folder
 * @example \`\`\`type User = ModelTypes['user']\`\`\`
*/
export type ModelTypes = {
    [K in keyof Result]: Result[K]['Read']
} & {
    [K in keyof Result as \`\${K & string}Write\`]: Result[K]['Write']
}`
      : 'export type ModelTypes = Record<string, any>'}
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