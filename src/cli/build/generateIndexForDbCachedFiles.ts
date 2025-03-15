

import Path from 'path'
import fs from 'fs-extra'
import { getDbConfigs, getMainConfig } from '../../helpers/getGreenDotConfigs'
import { C, capitalize1st } from 'topkat-utils'
import { greenDotCacheModuleFolder } from '../../helpers/getProjectPaths'




/** If this function is called alone, it will generate a default index file that is typescript valid and safe */
export async function generateIndexForDbCachedFiles(indexFile: ReturnType<typeof getNewIndexForDbCacheFileStructure> = getNewIndexForDbCacheFileStructure()) {

  const mainConfig = await getMainConfig()
  const dbConfigs = await getDbConfigs()

  const indexFileContent = `
${indexFile.imports}

type UserAdditionalFields = {
${[...mainConfig.allPermissions, ...mainConfig.allRoles.map(role => 'is' + capitalize1st(role))]
      .map(perm => `  ${perm}: 'boolean'`)
      .join('\n')}
}

export type AllModels = ${indexFile.allModels.length ? `{
    ${indexFile.allModels}
}` : 'Record<string, any>'}

export type DbIds = ${indexFile.dbIds.length ? `{
    ${indexFile.dbIds}
}` : 'Record<string, any>'}

export type MainDbName = ${mainConfig.defaultDatabaseName && dbConfigs.length ? `'${mainConfig.defaultDatabaseName}'` : 'string'}

type Result = MergeMultipleObjects<AllModels>

/** With this getter you can safely use your model types anywhere (even in db folders).
If you use straight type like \`\`\`User\`\`\`, it may error when you are in a database folder
 * @example \`\`\`type User = ModelTypes['user']\`\`\` 
*/
export type ModelTypes = {
    [K in keyof Result]: Result[K]['Read']
} & {
    [K in keyof Result as \`\${K & string}Write\`]: Result[K]['Write']
}
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