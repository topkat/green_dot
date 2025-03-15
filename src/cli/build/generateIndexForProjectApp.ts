
import Path from 'path'
import fs from 'fs-extra'
import { getProjectPaths } from '../../helpers/getProjectPaths'
import glob from 'fast-glob'
import { C } from 'topkat-utils'

// match .svc.ts, .schedule.ts or .event.ts files with first capture group to model name
const appFilesRegexp = /[/\\]([^/\\]+)\.(svc|schedule|event|error)\.ts$/

/** Generates index.generated.ts files in client APP folder */
export async function generateIndexForProjectApp() {

  const { appConfigs, mainConfig } = await getProjectPaths()

  for (const { generatedIndexPath, folderPath } of appConfigs) {
    const appPathRelative = Path.relative(mainConfig.folderPath, folderPath)
    try {

      const allFiles = await glob.async('**/*.@(svc|schedule|event|error).ts', {
        cwd: folderPath,
        onlyFiles: true,
        absolute: true,
      })

      const indexContent = {
        imports: ``,
        errorType: [] as string[],

      }

      for (const file of allFiles) {

        const match = file.match(appFilesRegexp) as [any, string, 'svc' | 'schedule' | 'event' | 'error']

        if (match) {

          const [, moduleName, moduleType] = match
          const relativeToRoot = Path.relative(folderPath, file).replace('.ts', '')

          if (moduleType === 'error') {
            indexContent.imports += `import ${moduleName}Errors from './${relativeToRoot}'\n`
            indexContent.errorType.push(`typeof ${moduleName}Errors`)
          } else {
            indexContent.imports += `export * from './${relativeToRoot}'\n`
          }
        }
      }

      const fileContent = `
import { RegisterErrorType } from 'green_dot'

${indexContent.imports}

declare global {
  interface GreenDotErrors extends RegisterErrorType<${indexContent.errorType.join(' & ') || '{}'}> { }
}
`

      await fs.outputFile(generatedIndexPath, fileContent, 'utf-8')

      C.success(`Generated index for /${appPathRelative} APP`)

    } catch (err) {
      C.error(err)
      throw C.error(false, 'ERROR CREATING INDEX FOR DATABASE /' + appPathRelative)
    }
  }
}