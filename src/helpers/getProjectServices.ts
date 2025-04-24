

import { getActiveAppConfig } from './getGreenDotConfigs'
import { ServicesObj } from '../types/core.types'

let activeAppServicesCache: Omit<ServicesObj, 'initClientApp'>

export async function getActiveAppServices(resetCache = false) {
  if (!activeAppServicesCache || resetCache) {

    const { generatedIndexPath } = await getActiveAppConfig()

    const { initApp, ...services } = await import(generatedIndexPath) as ServicesObj

    activeAppServicesCache = services

    await initApp()
  }
  return activeAppServicesCache
}
