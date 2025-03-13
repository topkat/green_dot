

import fs from 'fs-extra'
import { getProjectPaths } from '../helpers/getProjectPaths'
import glob from 'fast-glob'
import { C, capitalize1st, objEntries } from 'topkat-utils'

// match .model.ts or .dao.ts files with first capture group to model name
const modelOrDaoRegexp = /[/\\]([^/\\]+)\.(model|dao)\.ts$/

/** Generates index.generated.ts files in client database folder */
export async function generateIndexForProjectDb() {
  const { dbConfigs } = await getProjectPaths()

  for (const [dbName, { generatedIndexPath, folderPath }] of objEntries(dbConfigs)) {
    try {

      const allFiles = await glob.async('**/*.@(model|dao).ts', {
        cwd: folderPath,
        onlyFiles: true,
        absolute: true,
      })

      let imports = ''
      let types = ''
      let modelsVar = ''
      let daoVar = ''

      for (const file of allFiles) {
        const match = file.match(modelOrDaoRegexp) as [any, string, 'dao' | 'model']
        if (match && ! /[/\\]default\.dao\.ts/.test(file)) {

          const [, moduleName, moduleType] = match
          const moduleNameCapital = capitalize1st(moduleName)
          const moduleTypeCapital = capitalize1st(moduleType)

          imports += `import ${moduleName}${moduleTypeCapital} from './models/${moduleName}.${moduleType}'\n`

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

      const fileContent = `${imports}\n\n${types}\n\nconst models = {\n${modelsVar}}\n\nconst daos = {\n${daoVar}}\n\nexport { models, daos }`

      await fs.outputFile(generatedIndexPath, fileContent, 'utf-8')

      C.success(`Successfully generated index for ${dbName} database`)

    } catch (err) {
      C.error(err)
      throw C.error(false, 'ERROR CREATING INDEX FOR DATABASE ' + dbName)
    }
  }
}