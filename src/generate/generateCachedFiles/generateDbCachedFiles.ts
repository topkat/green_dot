
import Path from 'path'
import fs from 'fs-extra'
import { getGreenDotDbConfigs, getGreenDotConfig } from "../../databases/helpers/getGreenDotConfigs"
import { getGeneratedIndexForDatabase } from "../../databases/helpers/getProjectGeneratedIndexes"
import { C, capitalize1st } from 'topkat-utils'
import { Definition } from 'good-cop'


const greenDotCacheModuleFolder = Path.relative(__dirname, '../../cache/dbs')

console.log(`greenDotCacheModuleFolder`, greenDotCacheModuleFolder)
console.log(`__dirname`, __dirname)

if (!fs.existsSync(greenDotCacheModuleFolder)) throw C.error(false, 'ERROR: green_dot local cache folder for DB is not existing')


export async function generateDbCachedFiles(resetCache = false) {

  const indexFile = getNewIndexFileStructure()

  const dbConfigs = await getGreenDotDbConfigs(resetCache)

  for (const { name: dbName, dbs } of dbConfigs) {

    const { models } = await getGeneratedIndexForDatabase(dbName)

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


    //  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ╔══╗ ══╦══ ╔══╗   ╔═╗  ╔═╗    ╔══╗ ╔══╗ ╔══╗ ╦  ╦ ╔══╗   ═╦═ ╦╗ ╔ ╔═╗  ╔══╗ ═╗╔═
    //  ║ ═╦ ╠═   ║╚╗║ ╠═   ╠═╦╝ ╠══╣   ║   ╠═     ║  ║ ╠═╩╗   ║    ╠══╣ ║    ╠══╣ ╠═      ║  ║╚╗║ ║  ║ ╠═    ╠╣ 
    //  ╚══╝ ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚  ╩  ╩   ╩   ╚══╝   ╚══╝ ╚══╝   ╚══╝ ╩  ╩ ╚══╝ ╩  ╩ ╚══╝   ═╩═ ╩ ╚╩ ╚══╝ ╚══╝ ═╝╚═

    indexFile.imports += `import { AllModels as ${dbNameCapital}AllModels } from './${dbName}.modelTypes.generated.ts'\n`
    indexFile.allModels += `bangk: ${dbNameCapital}AllModels\n`
    indexFile.dbIds += `${dbName}: '${dbIds.join(`' | '`)}'\n`

    await generateDbIndexFile(indexFile)

  }
}

/** If this function is called alone, it will generate a default index file that is typescript valid and safe */
export async function generateDbIndexFile(indexFile: ReturnType<typeof getNewIndexFileStructure> = getNewIndexFileStructure()) {

  const mainConfig = await getGreenDotConfig()
  const dbConfigs = await getGreenDotDbConfigs()

  const indexFileContent = `
${indexFile.imports}

type AllModels = ${indexFile.allModels.length ? `{
    ${indexFile.allModels}
}`: 'Record<string, any>'}

type DbIds = ${indexFile.dbIds.length ? `{
    ${indexFile.dbIds}
}`: 'Record<string, any>'}

type MainDbName = ${mainConfig.defaultDatabaseName && dbConfigs.length ? `'${mainConfig.defaultDatabaseName}'` : 'string'}

export { AllModels, DbIds, MainDbName }
`

  await fs.outputFile(Path.join(greenDotCacheModuleFolder, name + '.modelTypes.generated.ts'), indexFileContent)
}


//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

function getNewIndexFileStructure() {
  return {
    imports: '',
    allModels: '',
    dbIds: 'Record<string, any>',
  }
}