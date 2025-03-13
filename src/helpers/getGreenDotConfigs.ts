import { C, objEntries, mergeDeepOverrideArrays } from 'topkat-utils'
import { GDpathConfig, getProjectPaths } from './getProjectPaths'
import { GreenDotDbConfig, GreenDotAppConfig } from '../types/core.types'
import { safeImport } from './safeImports'
import { greenDotConfigDefaults, GreenDotConfig, GreenDotConfigWithDefaults } from '../types/greenDotConfig.types'

//  ╦╗╔╦ ╔══╗ ═╦═ ╦╗ ╔   ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗
//  ║╚╝║ ╠══╣  ║  ║╚╗║   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦
//  ╩  ╩ ╩  ╩ ═╩═ ╩ ╚╩   ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝
let greenDotConfigsCache: GreenDotConfigWithDefaults & GDpathConfig

export async function getGreenDotConfig(resetCache = false) {
  try {
    await initGDconfigCache(resetCache)
    return greenDotConfigsCache
  } catch (err) {
    C.error(err)
    throw 'ERROR: There is probably a type error on your green_dot.config.ts file. Please check everything works as expected and read carrefully above log'
  }
}

/** /!\ use carrefully since it may not be instanciated */
export function getGreenDotConfigSync(resetCache = false): (typeof greenDotConfigsCache) | void {
  initGDconfigCache(resetCache)
  return greenDotConfigsCache
}


async function initGDconfigCache(resetCache) {
  if (!greenDotConfigsCache || resetCache === true) { // we don't want this process to happen each time we call that function
    const { mainConfig: mainConfigPaths } = await getProjectPaths()
    const conf = (await safeImport(mainConfigPaths.path))?.default as GreenDotConfig
    const confWithDefaults = mergeDeepOverrideArrays({} as GreenDotConfigWithDefaults, greenDotConfigDefaults, conf)
    greenDotConfigsCache = { ...confWithDefaults, ...mainConfigPaths }
  }
}

//  ╔═╗  ╔═╗    ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗ ╔═══
//  ║  ║ ╠═╩╗   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦ ╚══╗
//  ╚══╝ ╚══╝   ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝ ═══╝
const greenDotDbConfigsCache = [] as Array<GreenDotDbConfig & { name: string } & GDpathConfig>

export async function getGreenDotDbConfigs(resetCache = false) {
  let pathNameErrExtraInfos = 'unknown'
  try {

    if (greenDotDbConfigsCache.length === 0 || resetCache === true) { // we don't want this process to happen each time we call that function
      const { dbConfigs: dbConfigPaths } = await getProjectPaths()

      for (const [name, dbPath] of objEntries(dbConfigPaths)) {
        pathNameErrExtraInfos = dbPath.path
        const conf = (await safeImport(dbPath.path))?.default as GreenDotDbConfig
        greenDotDbConfigsCache.push({ ...conf, name, ...dbPath })
      }
    }

    return greenDotDbConfigsCache

  } catch (err) {
    C.error(err)
    throw `ERROR in ./${pathNameErrExtraInfos}/green_dot.db.config.ts: There is probably a type error on your file. Please check everything works as expected and read carrefully above log.`
  }
}



//  ╔══╗ ╔══╗ ╔══╗   ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗ ╔═══
//  ╠══╣ ╠══╝ ╠══╝   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦ ╚══╗
//  ╩  ╩ ╩    ╩      ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝ ═══╝

const greenDotAppConfigsCache = [] as Array<GreenDotAppConfig & { name: string } & GDpathConfig>

export async function getGreenDotAppConfigs(resetCache = false) {
  let pathNameErrExtraInfos = 'unknown'
  try {

    if (greenDotAppConfigsCache.length === 0 || resetCache === true) { // we don't want this process to happen each time we call that function
      const { appConfigs: appConfigPaths } = await getProjectPaths()

      for (const [name, appConfigPath] of objEntries(appConfigPaths)) {
        pathNameErrExtraInfos = appConfigPath.path
        const conf = (await safeImport(appConfigPath.path))?.default as GreenDotAppConfig
        greenDotAppConfigsCache.push({ ...conf, name, ...appConfigPath })
      }
    }

    return greenDotAppConfigsCache

  } catch (err) {
    C.error(err)
    throw `ERROR in ./${pathNameErrExtraInfos}/green_dot.app.config.ts: There is probably a type error on your file. Please check everything works as expected and read carrefully above log.`
  }
}
