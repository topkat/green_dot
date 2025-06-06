

import { Definition } from './lib/good-cop/src/index.js'
import type { ModelsWithDbNamesAndReadWrite, MainDbName } from './cache/dbs/index.generated.js'
import { getProjectDatabaseModelsSync } from './helpers/getProjectModelsAndDaos.js'


export const _ = new Definition<ModelsWithDbNamesAndReadWrite, MainDbName>(() => {
  return getProjectDatabaseModelsSync()
}).init()