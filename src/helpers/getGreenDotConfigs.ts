import { C, objEntries } from 'topkat-utils'
import { GDpathConfig, getProjectPaths } from './getProjectPaths'
import { GreenDotDbConfig, GreenDotConfig, GreenDotAppConfig } from '../types/core.types'

//  ╦╗╔╦ ╔══╗ ═╦═ ╦╗ ╔   ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗
//  ║╚╝║ ╠══╣  ║  ║╚╗║   ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦
//  ╩  ╩ ╩  ╩ ═╩═ ╩ ╚╩   ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝
let greenDotConfigsCache: GreenDotConfig & GDpathConfig

export async function getGreenDotConfig(resetCache = false) {
  try {

    if (!greenDotConfigsCache || resetCache === true) { // we don't want this process to happen each time we call that function
      const { mainConfig } = await getProjectPaths()
      const conf = (await import(mainConfig.path))?.default as GreenDotConfig
      greenDotConfigsCache = { ...conf, ...mainConfig }
    }

    return greenDotConfigsCache

  } catch (err) {
    C.error(err)
    throw 'ERROR: There is probably a type error on your green_dot.config.ts file. Please check everything works as expected and read carrefully above log'
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
        const conf = (await import(dbPath.path))?.default as GreenDotDbConfig
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
        const conf = (await import(appConfigPath.path))?.default as GreenDotAppConfig
        greenDotAppConfigsCache.push({ ...conf, name, ...appConfigPath })
      }
    }

    return greenDotAppConfigsCache

  } catch (err) {
    C.error(err)
    throw `ERROR in ./${pathNameErrExtraInfos}/green_dot.app.config.ts: There is probably a type error on your file. Please check everything works as expected and read carrefully above log.`
  }
}
