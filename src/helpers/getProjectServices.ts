

import { getActiveAppConfig } from './getGreenDotConfigs'
import { safeImport } from './safeImports'
import { ServicesObj } from '../types/core.types'

let activeAppServicesCache: ServicesObj


export async function getActiveAppServices(resetCache = false) {
  if (!activeAppServicesCache || resetCache) {
    const { generatedIndexPath } = await getActiveAppConfig()
    activeAppServicesCache = await safeImport(generatedIndexPath) as ServicesObj
  }
  return activeAppServicesCache
}
