
import Path from 'path'
import fs from 'fs-extra'
import glob from 'fast-glob'
import { C } from 'topkat-utils'

export type GDpathConfig = { path: string, folderPath: string }
type PathConfObj = { [appNames: string]: GDpathConfig & { generatedIndexPath: string } }

let greenDotPathsCache: {
  /** Path of green_dot.config.ts */
  mainConfig: GDpathConfig
  /** Paths to all green_dot.app.config.ts that can be found in the project alongside their app names (folder name)*/
  appConfigs: PathConfObj
  /** Paths to all green_dot.db.config.ts that can be found in the project alongside their DB names (folder name) */
  dbConfigs: PathConfObj
}




export async function getProjectPaths(resetCache = false) {

  if (!greenDotPathsCache || resetCache === true) {
    // FIND ROOT PATH
    let mainConfigPath = Path.join(process.cwd(), 'green_dot.config.ts')
    let exists = await fs.exists(mainConfigPath)
    if (!exists) mainConfigPath = Path.join(process.cwd(), '../green_dot.config.ts')
    exists = await fs.exists(mainConfigPath)
    if (!exists) mainConfigPath = Path.join(process.cwd(), '../../green_dot.config.ts')
    exists = await fs.exists(mainConfigPath)
    if (!exists) throw C.error(false, 'green_dot.config.ts NOT FOUND. Please ensure you run the command from a valid green_dot project')

    const rootPath = mainConfigPath.replace(/[/\\][^/\\]*$/, '')

    // FIND ALL GREEN DOT CONFIGS

    const allFiles = await glob.async('**/green_dot.*.config.*', {
      cwd: rootPath,
      ignore: ['node_modules/**', '**/.*/**'],
      onlyFiles: true,
      absolute: true,
    })

    const dbConfigPaths = allFiles
      .filter(fileName => fileName.includes('green_dot.db.config'))
      .reduce(configFilePathReducer, {} as PathConfObj)

    const appConfigPaths = allFiles
      .filter(fileName => fileName.includes('green_dot.app.config'))
      .reduce(configFilePathReducer, {} as PathConfObj)

    greenDotPathsCache = {
      mainConfig: { path: mainConfigPath, folderPath: rootPath },
      appConfigs: appConfigPaths,
      dbConfigs: dbConfigPaths,
    }
  }

  return greenDotPathsCache
}


//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

function configFilePathReducer(o: PathConfObj, path: string) {
  return {
    ...o, [path.replace(/.*[/\\]([^/\\]+?)(?:Db|-db)?[/\\]green_dot.*?config\.ts$/, '$1')]: {
      path: path,
      folderPath: path.replace(/[/\\]green_dot.[^/\\]*?config[^/\\]*?$/, ''),
      generatedIndexPath: path.replace(/[/\\]green_dot.[^/\\]*?config[^/\\]*?$/, Path.sep + 'index.generated.ts')
    }
  }
}