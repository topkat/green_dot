/**
 * TODO 
 */
import Path from 'path'
import fs from 'fs-extra'
import glob from 'fast-glob'
import { C } from 'topkat-utils'

export type GDpathConfig = { path: string, folderPath: string }
type PathConfObj = { [appNames: string]: GDpathConfig }

let greenDotPathsCache: {
  /** Path of green_dot.config.ts */
  mainConfig: GDpathConfig
  /** Paths to all green_dot.app.config.ts that can be found in the project alongside their app names (folder name)*/
  appConfigs: PathConfObj
  /** Paths to all green_dot.db.config.ts that can be found in the project alongside their DB names (folder name) */
  dbConfigs: PathConfObj
}




export async function getGreenDotPaths() {
  if (!greenDotPathsCache) await generateGreenDotPaths()
  return greenDotPathsCache
}




async function generateGreenDotPaths() {

  // FIND ROOT PATH
  let mainConfigPath = Path.join(process.cwd(), 'green_dot.config.ts')
  let exists = await fs.exists(mainConfigPath)
  if (!exists) mainConfigPath = Path.join(process.cwd(), '../green_dot.config.ts')
  exists = await fs.exists(mainConfigPath)
  if (!exists) mainConfigPath = Path.join(process.cwd(), '../../green_dot.config.ts')
  exists = await fs.exists(mainConfigPath)
  if (!exists) return C.error(false, 'green_dot.config.ts NOT FOUND. Please ensure you run the command from a valid green_dot project')

  const rootPath = mainConfigPath.replace(/\/[^\/]*$/, '')

  // FIND ALL GREEN DOT CONFIGS

  const allFiles = await glob.async('**/green_dot.*.config.*', {
    cwd: rootPath,         // Set the root path for searching
    ignore: ['node_modules/**', '**/.*/**'],  // Exclude node_modules and hidden folders
    onlyFiles: true,       // Ensure we only get files, not directories
  })



  const dbConfigPaths = allFiles
    .filter(fileName => fileName.includes('green_dot.db.config'))
    .reduce(configFilePathReducer, {} as PathConfObj)

  const appConfigPaths = allFiles
    .filter(fileName => fileName.includes('green_dot.app.config'))
    .reduce(configFilePathReducer, {} as PathConfObj)

  // GENERATE INDEXES FOR FILES

  console.log('allFiles', JSON.stringify(allFiles, null, 2))
  // .forEach(filePath => {
  //     if (!ignore.some(ignorePattern => filePath.includes(ignorePattern))) allFiles.push(filePath)
  //   })


  console.log(`exists `, exists)
  console.timeEnd('a')
  console.time('b')
  const aa = await import(Path.join(process.cwd(), 'green_dot.config.ts'))
  console.timeEnd('b')
  console.log('aa ', JSON.stringify(aa, null, 2))

  greenDotPathsCache = {
    mainConfig: { path: mainConfigPath, folderPath: rootPath },
    appConfigs: appConfigPaths,
    dbConfigs: dbConfigPaths,
  }

}



//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

function configFilePathReducer(o: PathConfObj, path: string) {
  return {
    ...o, [path.replace(/\/([^\/]+)\/green_dot.*?config/, '$1')]: {
      path: path,
      folderPath: path.replace(/\/green_dot.[^\/]*?config[^\/]*?$/, ''),
    }
  }
}