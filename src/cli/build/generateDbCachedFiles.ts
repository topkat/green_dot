
import Path from 'path'
import fs from 'fs-extra'
import { getDbConfigs, getMainConfig } from '../../helpers/getGreenDotConfigs'
import { getProjectDatabaseModelsForDbName } from '../../helpers/getProjectModelsAndDaos'
import { C, capitalize1st } from 'topkat-utils'
import { Definition } from 'good-cop'
import { GD_serverBlacklistModel } from '../../security/userAndConnexion/GD_serverBlackList.model'
import { greenDotCacheModuleFolder } from '../../helpers/getProjectPaths'
import { generateIndexForDbCachedFiles, getNewIndexForDbCacheFileStructure } from './generateIndexForDbCachedFiles'




/** This will generate a string representation of all db types in local green_dot module cache folder to be accessed in the project app with ```import { ModelTypes } from 'green_dot/db'``` */
export async function generateDbCachedFiles(resetCache = false) {

  const indexFile = getNewIndexForDbCacheFileStructure()

  const mainConfig = getMainConfig()
  const dbConfigs = getDbConfigs()

  for (const { name: dbName, dbs } of dbConfigs) {

    const models = await getProjectDatabaseModelsForDbName(dbName, resetCache)

    if (mainConfig.defaultDatabaseName === dbName) {
      models.GD_serverBlackList = GD_serverBlacklistModel as unknown as Definition
    }

    let modelTypeFileContent = `\n\n`
    const modelNames = Object.keys(models)
    const dbNameCapital = capitalize1st(dbName)

    const dbIds = Object.keys(dbs)
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

    modelTypeFileContent += `export type AllModels = {\n${modelNames.map(modelName => `    ${modelName}: ${capitalize1st(modelName + 'Models')}`).join(`\n`)}\n}\n\n`

    modelTypeFileContent += `export type ModelNames = keyof AllModels\n\n`

    await fs.outputFile(Path.join(greenDotCacheModuleFolder, dbName + '.modelTypes.generated.ts'), modelTypeFileContent)

    C.success(`Successfully generated ${dbName + '.modelTypes.generated.ts'}`)


    //  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ╔══╗ ══╦══ ╔══╗   ╔═╗  ╔═╗    ╔══╗ ╔══╗ ╔══╗ ╦  ╦ ╔══╗   ═╦═ ╦╗ ╔ ╔═╗  ╔══╗ ═╗╔═
    //  ║ ═╦ ╠═   ║╚╗║ ╠═   ╠═╦╝ ╠══╣   ║   ╠═     ║  ║ ╠═╩╗   ║    ╠══╣ ║    ╠══╣ ╠═      ║  ║╚╗║ ║  ║ ╠═    ╠╣
    //  ╚══╝ ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚  ╩  ╩   ╩   ╚══╝   ╚══╝ ╚══╝   ╚══╝ ╩  ╩ ╚══╝ ╩  ╩ ╚══╝   ═╩═ ╩ ╚╩ ╚══╝ ╚══╝ ═╝╚═

    indexFile.imports += `import { AllModels as ${dbNameCapital}AllModels } from './${dbName}.modelTypes.generated.ts'\n`
    if (dbName === mainConfig.defaultDatabaseName) {
      indexFile.allModels += `{ [K in keyof ${dbNameCapital}AllModels]: K extends 'user' ? ${dbNameCapital}AllModels[K] & { Read: UserPermissionFields, Write: Partial<UserPermissionFields> } : ${dbNameCapital}AllModels[K] }`
    } else {
      indexFile.allModels += `${dbName}: ${dbNameCapital}AllModels\n`
    }
    indexFile.dbIds += `${dbName}: '${dbIds.join(`' | '`)}'\n`

    await generateIndexForDbCachedFiles(indexFile)

  }
}

