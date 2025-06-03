

import { C, mergeDeepOverrideArrays } from 'topkat-utils'
import { GDpathConfig, GDpathConfigWithIndex, getProjectPaths } from './getProjectPaths'
import { GreenDotDbConfig, GreenDotAppConfig } from '../types/core.types'
import { safeImport } from './safeImports'
import { greenDotConfigDefaults, GreenDotConfig, GreenDotConfigWithDefaults } from '../types/mainConfig.types'
import { error } from '../error'
import { initProjectAndDaosCache } from './getProjectModelsAndDaos'
import { parentProcessExitCodes } from '../constants'
import { registerPlugin } from '../plugins/pluginSystem'

//  ═╦═ ╦╗ ╔ ═╦═ ══╦══
//   ║  ║╚╗║  ║    ║
//  ═╩═ ╩ ╚╩ ═╩═   ╩
export async function initGreenDotConfigs(resetCache = false) {
  await initMainConfigCache(resetCache)
  await Promise.all([
    initAppConfigCache(resetCache),
    initDbConfigCache(resetCache),
  ])
}

export function initEnv(conf: GreenDotConfig) {
  process.env.IS_PROD_ENV = conf.isProdEnv?.toString()
  process.env.IS_TEST_ENV = conf.isTestEnv?.toString()
  if (!process.env.NODE_ENV) process.env.NODE_ENV = conf.env
}

export async function initClientApp(conf: GreenDotConfig) {

  initEnv(conf)

  greenDotConfigsCache = computeMainConfigAdditionalFields({
    ...mergeDeepOverrideArrays({} as GreenDotConfigWithDefaults, greenDotConfigDefaults, conf),
  } as any)
  const { mainConfig: mainConfigPaths } = await getProjectPaths()

  Object.assign(greenDotConfigsCache, mainConfigPaths)

  await initGreenDotConfigs()

  await initProjectAndDaosCache()
}

//  ╦╗╔╦ ╔══╗ ═╦═ ╦╗ ╔   ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗
//  ║╚╝║ ╠══╣  ║  ║╚╗║   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦
//  ╩  ╩ ╩  ╩ ═╩═ ╩ ╚╩   ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝

let greenDotConfigsCache: (GreenDotConfigWithDefaults & GDpathConfig)

export function getMainConfig(silent = false): typeof greenDotConfigsCache {
  if (!greenDotConfigsCache && !silent) throw error.serverError('Trying to call getGreenDotConfig() but the cache has not been initialized. PLease call await initGreenDotConfigs() before all')
  if (!greenDotConfigsCache) return {} as typeof greenDotConfigsCache
  else return greenDotConfigsCache
}


export async function initMainConfigCache(resetCache = false) {
  if (!greenDotConfigsCache || resetCache === true) { // we don't want this process to happen each time we call that function
    const { mainConfig: mainConfigPaths } = await getProjectPaths()
    // /Users/garcias/DEV/BANGK/bangk-app-backend/green_dot.config.ts
    const { default: conf, initClientApp } = (await safeImport(mainConfigPaths.path)) as { default: GreenDotConfig, initClientApp: (conf: GreenDotConfig) => any }
    process.env.IS_PROD_ENV = conf.isProdEnv.toString()
    process.env.IS_TEST_ENV = conf.isTestEnv.toString()
    if (!process.env.NODE_ENV) process.env.NODE_ENV = conf.env
    const confWithDefaults = mergeDeepOverrideArrays({} as GreenDotConfigWithDefaults, greenDotConfigDefaults, conf)
    greenDotConfigsCache = computeMainConfigAdditionalFields({ ...confWithDefaults, ...mainConfigPaths })
    await initClientApp(conf)
  }
}



//  ╔═╗  ╔═╗    ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗ ╔═══
//  ║  ║ ╠═╩╗   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦ ╚══╗
//  ╚══╝ ╚══╝   ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝ ═══╝

let greenDotDbConfigsCache: Array<GreenDotDbConfig & GDpathConfigWithIndex>

export function getDbConfigs() {
  if (!greenDotDbConfigsCache) throw error.serverError('Trying to call getGreenDotDbConfigs() but the cache has not been initialized. PLease call await initGreenDotConfigs() before all')
  return greenDotDbConfigsCache
}

export async function getActiveDbConfig() {
  const { activeDb } = await getProjectPaths()
  if (!activeDb) throw error.serverError('Trying to call getActiveDbConfig() but not active Db is to be found')
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

const defaultAppConfig = {
  blackListBanMinutes: [15, 120, 12 * 60],
  blackListCheckInterval: process.env.NODE_ENV === 'test' ? 1000 : 3 * 60 * 1000,
  nbWarningsBeforeBan: 3,
} satisfies Partial<GreenDotAppConfig>

let greenDotAppConfigsCache: Array<GreenDotAppConfig & GDpathConfigWithIndex>

export function getAppConfigs() {
  if (!greenDotAppConfigsCache) throw error.serverError('Trying to call getAppConfigs() but the cache has not been initialized. PLease call await initGreenDotConfigs() before all')
  return greenDotAppConfigsCache

}

export async function getActiveAppConfig<T extends boolean>(
  silent: T = false as T
): Promise<T extends true ? (GreenDotAppConfig & GDpathConfigWithIndex) | undefined : GreenDotAppConfig & GDpathConfigWithIndex> {
  const { activeApp } = await getProjectPaths()
  if (activeApp && greenDotAppConfigsCache) {
    return greenDotAppConfigsCache.find(c => c.folderPath === activeApp.folderPath)
  } else if (!silent) {
    throw error.serverError('Trying to call getActiveAppConfig() but not active Db is to be found')
  }
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
        if (conf.plugins && conf.plugins.length) {
          for (const p of conf.plugins) {
            p?.onInit?.()
            registerPlugin(p)
          }
        }
        greenDotAppConfigsCache.push({ ...defaultAppConfig, ...conf, ...appConfigPath })
      }
    } catch (err) {
      C.error(err)
      C.error(false, `ERROR in .${pathNameErrExtraInfos}/green_dot.app.config.ts: There is probably a type error on your file. Please check everything works as expected and read carrefully above log.`)
      setTimeout(() => process.exit(parentProcessExitCodes.waitForFileChange))
    }
  }
}

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

function computeMainConfigAdditionalFields(conf: GreenDotConfig): GreenDotConfigWithDefaults & GDpathConfig {
  (conf as any).platforms = Object.values(conf?.generateSdkConfig?.sdkNameForRole || 'default')
  return conf as any
}