

import { Definition } from 'good-cop'
import { AllModels, MainDbName } from './cache/dbs/index.generated'
import { getProjectDatabaseModelsSync } from './helpers/getProjectModelsAndDaos'

export const _ = new Definition<AllModels, MainDbName>(getProjectDatabaseModelsSync).init()