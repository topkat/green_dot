

import Path from 'path'
import fs from 'fs-extra'
import { getProjectPaths } from '../../helpers/getProjectPaths'
import glob from 'fast-glob'
import { C, capitalize1st } from 'topkat-utils'

// match .model.ts or .dao.ts files with first capture group to model name
const modelOrDaoRegexp = /[/\\]([^/\\]+)\.(model|dao)\.ts$/

/** Generates index.generated.ts files in client database folder */
export async function generateIndexForProjectDb() {

  const { dbConfigs, mainConfig } = await getProjectPaths()
  console.log('dbConfigs', JSON.stringify(dbConfigs, null, 2))
  console.log('mainConfig', JSON.stringify(mainConfig, null, 2))
  for (const { generatedIndexPath, folderPath } of dbConfigs) {
    console.log(`generatedIndexPath`, generatedIndexPath, folderPath)
    const dbPathRelative = Path.relative(mainConfig.folderPath, folderPath)
    try {
      const allFiles = await glob.async('**/*.@(model|dao).ts', {
        cwd: folderPath,
        onlyFiles: true,
        absolute: true,
      })

      console.log(`allFiles`)

      let topOfFile = ''
      let types = ''
      let modelsVar = ''
      let daoVar = ''

      for (const file of allFiles) {
        const match = file.match(modelOrDaoRegexp) as [any, string, 'dao' | 'model']
        const isDefault = /[/\\]default\.dao\.ts/.test(file)
        const relativeToRoot = Path.relative(folderPath, file).replace('.ts', '')

        if (isDefault) {
          topOfFile += `import _defaultDao from './${relativeToRoot}'\n`
          daoVar += `  _defaultDao,\n`
        } else if (match) {

          const [, moduleName, moduleType] = match
          const moduleNameCapital = capitalize1st(moduleName)
          const moduleTypeCapital = capitalize1st(moduleType)

          topOfFile += `import ${moduleName}${moduleTypeCapital} from './${relativeToRoot}'\n`

          if (moduleType === 'model') {
            types += `export type ${moduleNameCapital} = typeof ${moduleName}Model.tsTypeRead\n` +
              `export type ${moduleNameCapital}Read = typeof ${moduleName}Model.tsTypeRead\n` +
              `export type ${moduleNameCapital}Write = typeof ${moduleName}Model.tsTypeWrite\n`

            modelsVar += `  ${moduleName}Model,\n`
          } else {
            daoVar += `  ${moduleName}Dao,\n`
          }
        }
      }

      const fileContent = `
${topOfFile}

${types}

const models = {
${modelsVar}\
}

const daos = {
${daoVar}\
}

export { models, daos }`

      await fs.outputFile(generatedIndexPath, fileContent, 'utf-8')

      C.success(`Generated index for /${dbPathRelative} DB`)

    } catch (err) {
      C.error(err)
      throw C.error(false, 'ERROR CREATING INDEX FOR DATABASE /' + dbPathRelative)
    }
  }
}