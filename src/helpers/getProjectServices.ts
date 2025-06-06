

import { getActiveAppConfig } from './getGreenDotConfigs.js'
import { GreenDotAppConfig, ServicesObj } from '../types/core.types.js'
import { GDpathConfigWithIndex } from './getProjectPaths.js'
import { getAllPluginServices } from '../plugins/pluginSystem.js'
import { safeImport } from './safeImports.js'

let activeAppServicesCache: Omit<ServicesObj, 'initClientApp'>

export async function getActiveAppServices(
  appConfig?: GreenDotAppConfig & GDpathConfigWithIndex,
  resetCache = false
) {

  if (!appConfig) appConfig = await getActiveAppConfig()

  if (!activeAppServicesCache || resetCache) {

    const { generatedIndexPath } = appConfig

    const { initApp, ...services } = await safeImport(generatedIndexPath) as ServicesObj

    activeAppServicesCache = { ...services, ...getAllPluginServices() }

    await initApp()
  }
  return activeAppServicesCache
}
