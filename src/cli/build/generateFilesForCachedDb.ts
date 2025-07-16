
import Path from 'path'
import fs from 'fs-extra'
import { getDbConfigs, getMainConfig } from '../../helpers/getGreenDotConfigs.js'
import { getProjectDatabaseModelsForDbName } from '../../helpers/getProjectModelsAndDaos.js'
import { C, capitalize1st } from 'topkat-utils'
import { Definition } from '../../lib/good-cop/index-backend.js'
import { GD_serverBlacklistModel } from '../../security/userAndConnexion/GD_serverBlackList.model.js'
import { GD_deviceModel } from '../../security/userAndConnexion/GD_device.model.js'
import { greenDotCacheModuleFolder } from '../../helpers/getProjectPaths.js'
import { getNewIndexForDbCacheFileStructure } from './generateIndexForDbIndex.js'




/** This will generate a string representation of all db types in local green_dot module cache folder to be accessed in the project app with ```import { ModelTypes } from 'green_dot/db.js'``` */
export async function generateFilesForCachedDb(
  resetCache = false,
  basePath = Path.join(greenDotCacheModuleFolder, 'dbs')
) {

  const indexFile = getNewIndexForDbCacheFileStructure()

  const mainConfig = getMainConfig()
  const dbConfigs = getDbConfigs()

  for (const { name: dbName, dbs } of dbConfigs) {

    const models = await getProjectDatabaseModelsForDbName(dbName, resetCache)

    if (mainConfig.defaultDatabaseName === dbName) {
      models.GD_serverBlackList = GD_serverBlacklistModel as unknown as Definition
      models.GD_device = GD_deviceModel as unknown as Definition
    }

    let modelTypeFileContent = `import { TranslationObj } from '${basePath.includes(greenDotCacheModuleFolder) ? '../../index.js' : 'green_dot'}'\n\n`
    const modelNames = Object.keys(models)
    const dbNameCapital = capitalize1st(dbName)

    const dbIds = typeof dbs.connexionString === 'string' ? [dbName] : Object.keys(dbs.connexionString)
    if (!dbIds.length) continue

    //  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ╔══╗ ══╦══ ╔══╗   ╔═╗  ╔═╗    ══╦══ ╦   ╦ ╔══╗ ╔══╗ ╔═══
    //  ║ ═╦ ╠═   ║╚╗║ ╠═   ╠═╦╝ ╠══╣   ║   ╠═     ║  ║ ╠═╩╗     ║   ╚═╦═╝ ╠══╝ ╠═   ╚══╗
    //  ╚══╝ ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚  ╩  ╩   ╩   ╚══╝   ╚══╝ ╚══╝     ╩     ╩   ╩    ╚══╝ ═══╝

    for (const [modelName, model] of Object.entries(models) as [string, Definition][]) {
      const modelNameCapital = capitalize1st(modelName)

      const tsTypes = model.getTsTypeAsString()

      for (const meth of ['read', 'write'] as const) {
        tsTypes[meth] = tsTypes[meth].replace(/modelTypes\./g, '')
      }

      modelTypeFileContent += `export type ${modelNameCapital} = ${tsTypes.read}\n\n`
      modelTypeFileContent += `export type ${modelNameCapital}Write = ${tsTypes.write}\n\n`
      modelTypeFileContent += `export interface ${modelNameCapital}Models {\n    Write: ${modelNameCapital}Write\n    Read: ${modelNameCapital}\n}\n\n`
    }

    modelTypeFileContent += `export type AllModels = {\n${modelNames.map(modelName => `    ${modelName}: ${capitalize1st(modelName + 'Models')}`).join(`\n`)}\n}\n\ntype ModelsWithReadWrite = AllModels\n\n`

    modelTypeFileContent += `export type ModelNames = keyof AllModels\n\n`

    await fs.outputFile(Path.join(basePath, dbName + '.modelTypes.generated.ts'), modelTypeFileContent)

    C.success(`Successfully generated ${dbName + '.modelTypes.generated.ts'}`)

    //  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ╔══╗ ══╦══ ╔══╗   ╔═╗  ╔═╗    ╔══╗ ╔══╗ ╔══╗ ╦  ╦ ╔══╗   ═╦═ ╦╗ ╔ ╔═╗  ╔══╗ ═╗╔═
    //  ║ ═╦ ╠═   ║╚╗║ ╠═   ╠═╦╝ ╠══╣   ║   ╠═     ║  ║ ╠═╩╗   ║    ╠══╣ ║    ╠══╣ ╠═      ║  ║╚╗║ ║  ║ ╠═    ╠╣
    //  ╚══╝ ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚  ╩  ╩   ╩   ╚══╝   ╚══╝ ╚══╝   ╚══╝ ╩  ╩ ╚══╝ ╩  ╩ ╚══╝   ═╩═ ╩ ╚╩ ╚══╝ ╚══╝ ═╝╚═

    indexFile.imports += `import { AllModels as ${dbNameCapital}AllModels } from './${dbName}.modelTypes.generated.js'\n`
    if (dbName === mainConfig.defaultDatabaseName) {
      indexFile.allModels += `    ${dbName}: { [K in keyof ${dbNameCapital}AllModels]: K extends 'user' ? ${dbNameCapital}AllModels[K] & { Read: UserPermissionFields & UserAdditionalFieldsRead, Write: Partial<UserPermissionFields & UserAdditionalFieldsWrite> } : ${dbNameCapital}AllModels[K] }\n`
      indexFile.allModels += `    default: { [K in keyof ${dbNameCapital}AllModels]: K extends 'user' ? ${dbNameCapital}AllModels[K] & { Read: UserPermissionFields & UserAdditionalFieldsRead, Write: Partial<UserPermissionFields & UserAdditionalFieldsWrite> } : ${dbNameCapital}AllModels[K] }\n`
    } else {
      indexFile.allModels += `    ${dbName}: ${dbNameCapital}AllModels\n`
    }
    indexFile.dbIds += `    ${dbName}: '${dbIds.join(`' | '`)}'\n`

  }

  return indexFile
}

