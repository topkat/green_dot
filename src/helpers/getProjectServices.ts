

import { getActiveAppConfig } from './getGreenDotConfigs'
import { GreenDotAppConfig, ServicesObj } from '../types/core.types'
import { GDpathConfigWithIndex } from './getProjectPaths'

let activeAppServicesCache: Omit<ServicesObj, 'initClientApp'>

export async function getActiveAppServices(
  appConfig?: GreenDotAppConfig & GDpathConfigWithIndex,
  resetCache = false
) {

  if (!appConfig) appConfig = await getActiveAppConfig()

  if (!activeAppServicesCache || resetCache) {

    const { generatedIndexPath } = appConfig

    const { initApp, ...services } = await import(generatedIndexPath) as ServicesObj

    activeAppServicesCache = services

    await initApp()
  }
  return activeAppServicesCache
}
