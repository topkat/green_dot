

import fs from 'fs-extra'
import Path from 'path'
import { templater } from 'simple-file-templater'
import { C, objEntries } from 'topkat-utils'
import { AllMethodsObjectForSdk } from '../../types/generateSdk.types'
import { GreenDotConfig } from '../../types/mainConfig.types'
import { compileTypeScriptProject } from '../../helpers/tsCompiler'
import { greenDotCacheModuleFolder } from '../../helpers/getProjectPaths'




export async function generateSdkFolderFromTemplates(
  platform: string,
  sdkRoot: string,
  repoRoot: string,
  // <DO_NOT> get MAIN CONFIG in this file because we may be in safe mode
  platforms: string[],
  generateSdkConfig = {} as GreenDotConfig['generateSdkConfig'],
  // </DO_NOT>
  // Optinal params
  allMethodsObjectForSdk: AllMethodsObjectForSdk = { dbRead: {}, dbWrite: {}, service: {} },
  tsApiTypes: string = '',
  allMethodNames: string[] = [],
  backendProjectForSdk: string[] = [],
  queriesToInvalidate: { [query: string]: string[] } = {},
) {

  const allMethodsString = JSON.stringify(allMethodsObjectForSdk)

  const isDefaultSdk = tsApiTypes === ''

  const packageJsonPath = Path.join(sdkRoot, 'package.json')
  const fileSizesPath = Path.join(sdkRoot, 'fileSizes.json')
  let packageVersion = '1.0.0'
  if (await fs.exists(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
      packageVersion = packageJson.version
    } catch (err) {
      C.error(false, 'Error reading package.json at ' + packageJsonPath)
    }
  }

  let fileSizeContent: string
  if (await fs.exists(fileSizesPath)) {
    fileSizeContent = await fs.readFile(fileSizesPath, 'utf-8')
  }

  await fs.remove(sdkRoot)

  // allow to store filesize between resets and thus detect changes in SDK
  if (fileSizeContent) await fs.outputFile(fileSizesPath, fileSizeContent)

  const queriesToInvalidateString = objEntries(queriesToInvalidate).map(([q, strs]) => {
    return strs.length ? `$.addQueriesToInvalidate.${q}(['${strs.join(`', '`)}'])` : ''
  }).join('\n')

  const packageNamePrefix = generateSdkConfig?.npmPublishPromptConfig?.packageNamePrefix ? generateSdkConfig.npmPublishPromptConfig.packageNamePrefix.replace(/\/$/, '') + '/' : ''

  const replaceInFiles: [string: string | RegExp, replacement: string][] = [
    ['%%packageVersion%%', packageVersion],
    [`%%appName%%`, platform],
    [`%%app-name%%`, platform.replace(/([A-Z])/g, '-$1').toLocaleLowerCase()],
    [`%%packageNamePrefix%%`, packageNamePrefix],
    [`%%packageNameAccess%%`, generateSdkConfig?.npmPublishPromptConfig?.access || 'public'],
    [`'%%AllReadMethodsAndService%%'`, allMethodsString],
    [`'%%tsApiTypes%%'`, tsApiTypes],
    [`'%%allAppNamesTypeString%%'`, arrOrAny(platforms)],
    [`'%%AllMethodNameTypeString%%'`, arrOrAny(allMethodNames)],
    [`'%%allBackendFoldersForSdk%%'`, arrOrAny(backendProjectForSdk)],
    [`'%%queriesToInvalidate%%'`, queriesToInvalidateString],
  ]

  if (!isDefaultSdk) {
    replaceInFiles.push([/%%toDeleteRealSdk .* toDeleteRealSdk%%/, ''])
  }

  await templater(
    Path.resolve(__dirname, '../../../templates/sdkTemplate'),
    sdkRoot,
    [
      ...replaceInFiles,
    ],
    [
      ['.template', '']
    ]
  )

  // COMMON JS MODULES
  await templater(
    Path.resolve(__dirname, '../../../templates/sdkTemplate'),
    sdkRoot,
    [
      ...replaceInFiles,
      // ESM => COMMON JS

      // Import default
      [/import ([^\s]*) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
      // Import named
      [/import {([^}]+)} from ['"]([^'"]+)['"]/g, 'const {$1} = require(\'$2\')'],
      // Import all
      [/import \* as ([^\s]+) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
      // Export default
      [/export default ([^\s]+)/g, 'module.exports = $1'],
      // Export named
      [/export (?:const|let|var|function) ([^\s(]+) ?=?/g, 'exports.$1 ='],

      [/export \{/, 'module.exports = {'],
      // extensions in imports (avoid targetting package.json "exports")
      [/(import .*)\.mjs/g, `$1.cjs`],
      [/(require.*)\.mjs/g, `$1.cjs`],
    ],
    [
      ['.template', ''],
      ['.mjs', '.cjs'],
    ],
    [/\.ts$/]
  )

  //----------------------------------------
  // SDK HELPER
  //----------------------------------------

  // COMPILE
  const sdkHelperDistPath = Path.join(greenDotCacheModuleFolder, '/sdkHelperDist')

  if (!await fs.exists(sdkHelperDistPath)) {
    const sdkHelperFolderPath = Path.resolve(__dirname, '../../../templates/sdkHelpersModule')
    if (! await fs.exists(sdkHelperFolderPath)) throw new Error('sdkHelperFolderPath not existing in green_dot: ' + sdkHelperFolderPath)
    await compileTypeScriptProject({
      projectPath: sdkHelperFolderPath,
      outputPath: Path.join(greenDotCacheModuleFolder, '/sdkHelperDist'),
    })
  }

  // COPY
  const sdkHelperPath = Path.join(sdkRoot, 'sdkHelpers')
  if (await fs.exists(sdkHelperPath)) await fs.remove(sdkHelperPath)
  await fs.copy(sdkHelperDistPath, sdkHelperPath)

}

function arrOrAny(arr: any[]) {
  return arr.length ? `'${arr.join(`' | '`)}'` : 'any'
}
