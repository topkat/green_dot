

import { getActiveAppConfig } from './getGreenDotConfigs'
import { ServicesObj } from '../types/core.types'

let activeAppServicesCache: ServicesObj

export async function getActiveAppServices(resetCache = false) {
  if (!activeAppServicesCache || resetCache) {

    const { generatedIndexPath } = await getActiveAppConfig()

    activeAppServicesCache = await import(generatedIndexPath) as ServicesObj

  }
  return activeAppServicesCache
}
