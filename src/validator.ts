

import { Definition } from 'good-cop'
import type { ModelsWithDbNamesAndReadWrite, MainDbName } from './cache/dbs/index.generated'
import { getProjectDatabaseModelsSync } from './helpers/getProjectModelsAndDaos'


export const _ = new Definition<ModelsWithDbNamesAndReadWrite, MainDbName>(() => {
  return getProjectDatabaseModelsSync()
}).init()