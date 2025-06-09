

import Path from 'path'
import fs from 'fs-extra'
import { getDbConfigs, getMainConfig } from '../../helpers/getGreenDotConfigs.js'
import { C } from 'topkat-utils'
import { greenDotCacheModuleFolder } from '../../helpers/getProjectPaths.js'
import { getUserPermissionFields } from '../../helpers/getProjectModelsAndDaos.js'


/** If this function is called alone, it will generate a default index file that is typescript valid and safe */
export async function generateIndexForDbTypeFiles(
  indexFile: ReturnType<typeof getNewIndexForDbCacheFileStructure>,
  {
    outputFolder = Path.join(greenDotCacheModuleFolder, 'dbs'),
    outputFileNameWithoutExtension = 'index.generated',
    hardCodePermissionFields = false
  } = {}
) {

  const isCacheOutput = !outputFolder || outputFolder.includes(greenDotCacheModuleFolder)
  outputFolder ??= Path.join(greenDotCacheModuleFolder, 'dbs')

  let indexFileContent = ''

  // BUILDED FILE
  const mainConfig = getMainConfig()
  const dbConfigs = getDbConfigs()

  const permFields = getUserPermissionFields()

  const permType = `
type UserPermissionFields = {
${permFields.map(perm => `  ${perm}: boolean`).join('\n')}
}
`

  indexFileContent += `
import { MergeMultipleObjects } from 'typescript-generic-types'
import { UserAdditionalFieldsRead, UserAdditionalFieldsWrite } from ${isCacheOutput ? `'../../security/userAndConnexion/userAdditionalFields.js'` : `'green_dot'`}
${indexFile.imports}

${hardCodePermissionFields ? permType : ''}\

export type ModelsWithDbNamesAndReadWrite = {
${indexFile.allModels}\
}

export type DbIds = {
    default: 'default'
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

  await fs.outputFile(Path.join(outputFolder, outputFileNameWithoutExtension + '.ts'), indexFileContent)

  if (outputFolder.includes('cache')) C.success(`Successfully generated local cache/dbs/index.generated.ts`)
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