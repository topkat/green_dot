
import 'typescript-generic-types'
import './types/global.types'

export { coreTestSuite } from './tests/core.testSuite'

export { svc, schedule } from './service'

export { error, type RegisterErrorType, registerErrors } from './error'
export { unPopulate } from './databases/mongo/services/populateService'
export * from './startServer'
export { generateMainBackendFiles } from './generate/generateMainBackendFiles'
export { newSystemCtx, newPublicCtx, CtxClass, isAnonymousUser, systemUserId, publicUserId, technicalRoles, systemRole, publicRole, authenticationMethod, ctx } from './ctx'
export * from './types/core.types'
export * as CoreTypes from './types/core.types'
export { loginHookDefault } from './databases/0_hooks/loginHookDefault'
export { applyMaskOnObjectForUser } from './databases/mongo/services/maskService'


export { genericHookInterpreter } from './databases/0_hooks/hookInterpreterGeneric'
export { getApiEndpointsPerRolesFromDao } from './databases/helpers/getApiEndpointsPerRolesFromDao'

export * from './databases/mongo/types/mongoDbTypes'

export { type InferTypeRead, type InferTypeWrite, type InferType, Definition } from 'good-cop'

export { RateLimiterConfig } from './security/serviceRouteRateLimiter'

export { makeApiCall } from './services/makeApiCall'

export { _ } from './validator'

export { db, dbs, getUserPermissionFields, Db, Dbs } from './db'
export { ModelTypes, ModelNames, ModelNamesForDb, MainDbName, ModelsWithDbNamesAndReadWrite as AllModelsWithReadWrite } from './cache/dbs/index.generated'

export { getActiveAppConfig, getActiveDbConfig, getMainConfig, initMainConfigCache, registerMainConfig } from './helpers/getGreenDotConfigs'

export { env } from './helpers/getEnv'

export { sendEmail } from './services/sendEmail'

export { generateUniqueToken } from './services/generateUniqueToken'

export { init } from './init'
export { initDbs } from './db'

export { startServer, stopServer } from './startServer'

export { assert } from './restTest/rest-test'
export { RestTestConfig, TestSuite, TestItem } from './restTest/rest-test-types'