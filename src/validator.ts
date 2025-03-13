import { Definition } from 'good-cop/backend'
import { AllModels, MainDbName } from './cache/dbs/index.generated'
import { getProjectDatabaseModelsSync } from './helpers/getProjectDatabase'

getProjectDatabaseModelsSync() // init cache while server is starting, unfortunately actually we need a sync version

export const _ = new Definition<AllModels, MainDbName>(getProjectDatabaseModelsSync).init()