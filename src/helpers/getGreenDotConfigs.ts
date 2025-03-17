

import { C, mergeDeepOverrideArrays } from 'topkat-utils'
import { GDpathConfig, GDpathConfigWithIndex, getProjectPaths } from './getProjectPaths'
import { GreenDotDbConfig, GreenDotAppConfig } from '../types/core.types'
import { safeImport } from './safeImports'
import { greenDotConfigDefaults, GreenDotConfig, GreenDotConfigWithDefaults } from '../types/mainConfig.types'
import { throwError } from '../core.error'

//  ═╦═ ╦╗ ╔ ═╦═ ══╦══
//   ║  ║╚╗║  ║    ║
//  ═╩═ ╩ ╚╩ ═╩═   ╩
export async function initGreenDotConfigs(resetCache = false) {
  await initMainConfigCache(resetCache)
  await initAppConfigCache(resetCache)
  await initDbConfigCache(resetCache)
}

export function registerMainConfig(conf: GreenDotConfig) {
  greenDotConfigsCache = {
    ...mergeDeepOverrideArrays({} as GreenDotConfigWithDefaults, greenDotConfigDefaults, conf),
  } as any
  getProjectPaths().then(({ mainConfig: mainConfigPaths }) => {
    Object.assign(greenDotConfigsCache, mainConfigPaths)
  })
}

//  ╦╗╔╦ ╔══╗ ═╦═ ╦╗ ╔   ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗
//  ║╚╝║ ╠══╣  ║  ║╚╗║   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦
//  ╩  ╩ ╩  ╩ ═╩═ ╩ ╚╩   ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝

let greenDotConfigsCache: GreenDotConfigWithDefaults & GDpathConfig

export function getMainConfig(silent = false): typeof greenDotConfigsCache {
  if (!greenDotConfigsCache && !silent) throw throwError.serverError('Trying to call getGreenDotConfig() but the cache has not been initialized. PLease call await initGreenDotConfigs() before all')
  return greenDotConfigsCache
}


async function initMainConfigCache(resetCache = false) {
  if (!greenDotConfigsCache || resetCache === true) { // we don't want this process to happen each time we call that function
    const { mainConfig: mainConfigPaths } = await getProjectPaths()
    const conf = (await safeImport(mainConfigPaths.path))?.default as GreenDotConfig
    const confWithDefaults = mergeDeepOverrideArrays({} as GreenDotConfigWithDefaults, greenDotConfigDefaults, conf)
    greenDotConfigsCache = { ...confWithDefaults, ...mainConfigPaths, platforms: Object.values(confWithDefaults.generateSdkConfig.sdkNameForRole || 'default') }
  }
}



//  ╔═╗  ╔═╗    ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗ ╔═══
//  ║  ║ ╠═╩╗   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦ ╚══╗
//  ╚══╝ ╚══╝   ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝ ═══╝

let greenDotDbConfigsCache: Array<GreenDotDbConfig & GDpathConfigWithIndex>

export function getDbConfigs() {
  if (!greenDotConfigsCache) throw throwError.serverError('Trying to call getGreenDotDbConfigs() but the cache has not been initialized. PLease call await initGreenDotConfigs() before all')
  return greenDotDbConfigsCache
}

export async function getActiveDbConfig() {
  const { activeDb } = await getProjectPaths()
  if (!activeDb) throw throwError.serverError('Trying to call getActiveDbConfig() but not active Db is to be found')
  return greenDotDbConfigsCache.find(c => c.folderPath === activeDb.folderPath)
}

async function initDbConfigCache(resetCache = false) {
  let pathNameErrExtraInfos = 'unknown'
  try {

    if (!greenDotDbConfigsCache || resetCache === true) { // we don't want this process to happen each time we call that function
      greenDotDbConfigsCache = []
      const { dbConfigs: dbConfigPaths } = await getProjectPaths()

      for (const dbPath of dbConfigPaths) {
        pathNameErrExtraInfos = dbPath.path
        const conf = (await safeImport(dbPath.path))?.default as GreenDotDbConfig
        greenDotDbConfigsCache.push({ ...conf, ...dbPath })
      }
    }
  } catch (err) {
    C.error(err)
    throw `ERROR in .${pathNameErrExtraInfos}/green_dot.db.config.ts: There is probably a type error on your file. Please check everything works as expected and read carrefully above log.`
  }
}


//  ╔══╗ ╔══╗ ╔══╗   ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗ ╔═══
//  ╠══╣ ╠══╝ ╠══╝   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦ ╚══╗
//  ╩  ╩ ╩    ╩      ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝ ═══╝

let greenDotAppConfigsCache: Array<GreenDotAppConfig & GDpathConfigWithIndex>

export function getAppConfigs() {
  if (!greenDotConfigsCache) throw throwError.serverError('Trying to call getGreenDotDbConfigs() but the cache has not been initialized. PLease call await initGreenDotConfigs() before all')
  return greenDotAppConfigsCache

}

export async function getActiveAppConfig() {
  const { activeApp } = await getProjectPaths()
  if (!activeApp) throw throwError.serverError('Trying to call getActiveAppConfig() but not active Db is to be found')
  return greenDotAppConfigsCache.find(c => c.folderPath === activeApp.folderPath) as GreenDotAppConfig & GDpathConfigWithIndex
}

async function initAppConfigCache(resetCache = false) {
  if (!greenDotAppConfigsCache || resetCache === true) {
    let pathNameErrExtraInfos = 'unknown'
    try {
      greenDotAppConfigsCache = []
      const { appConfigs: appConfigPaths } = await getProjectPaths()

      for (const appConfigPath of appConfigPaths) {
        pathNameErrExtraInfos = appConfigPath.path
        const conf = (await safeImport(appConfigPath.path))?.default as GreenDotAppConfig
        greenDotAppConfigsCache.push({ ...conf, ...appConfigPath })
      }
    } catch (err) {
      C.error(err)
      throw `ERROR in .${pathNameErrExtraInfos}/green_dot.app.config.ts: There is probably a type error on your file. Please check everything works as expected and read carrefully above log.`
    }
  }
}

