import { defaultPermissions } from '../types/coreGeneric.types.js'
import { getMainConfig } from './getGreenDotConfigs.js'


export function getAllPermissions() {
  const mainConfig = getMainConfig()
  return [...(mainConfig.allPermissions), ...defaultPermissions]
}