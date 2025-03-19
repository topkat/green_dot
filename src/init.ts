


import { initGreenDotConfigs } from './helpers/getGreenDotConfigs'
import { initProjectAndDaosCache } from './helpers/getProjectModelsAndDaos'

export async function init() {
  await initGreenDotConfigs()
  await initProjectAndDaosCache()
}