

import { Definition } from 'good-cop'
import { AllModelsWithReadWrite, MainDbName } from './cache/dbs/index.generated'
import { getProjectDatabaseModelsSync } from './helpers/getProjectModelsAndDaos'

export const _ = new Definition<AllModelsWithReadWrite, MainDbName>(getProjectDatabaseModelsSync).init()