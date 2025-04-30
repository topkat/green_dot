
import 'typescript-generic-types'
import './types/global.types'

export { coreTestSuite } from './tests/core.testSuite'

export { svc, schedule } from './service'

export { error, type RegisterErrorType, registerErrors } from './error'
export { unPopulate } from './databases/mongo/services/populateService'
export * from './startServer'

export { newSystemCtx, newPublicCtx, CtxClass, isAnonymousUser, systemUserId, publicUserId, technicalRoles, systemRole, publicRole, authenticationMethod, ctx } from './ctx'
export * from './types/core.types'
export * as CoreTypes from './types/core.types'
export { loginHookDefault } from './databases/0_hooks/loginHookDefault'
export { applyMaskOnObjectForUser } from './databases/mongo/services/maskService'


export { genericHookInterpreter } from './databases/0_hooks/hookInterpreterGeneric'
export { getApiEndpointsPerRolesFromDao } from './databases/helpers/getApiEndpointsPerRolesFromDao'

export * from './databases/mongo/types/mongoDbTypes'

export { type InferTypeRead, type InferTypeWrite, type InferType, Definition } from 'good-cop'

export type { RateLimiterConfig } from './security/serviceRouteRateLimiter'

export { makeApiCall } from './services/makeApiCall'

export { _ } from './validator'

export { db, dbs, dbCache, getUserPermissionFields, type Db, type Dbs } from './db'
export type { ModelTypes, ModelNames, ModelNamesForDb, MainDbName, ModelsWithDbNamesAndReadWrite as AllModelsWithReadWrite } from './cache/dbs/index.generated'

export { getActiveAppConfig, getActiveDbConfig, getMainConfig, initMainConfigCache, initClientApp } from './helpers/getGreenDotConfigs'

export { env } from './helpers/getEnv'

export { sendEmail } from './services/sendEmail'

export { generateUniqueToken } from './services/generateUniqueToken'

// export { init } from './init'
export { initDbs } from './db'

export { startServer, stopServer } from './startServer'

export { assert, testRunner } from './restTest/rest-test'
export type { GreenDotApiTestsConfig, TestSuite, TestItem } from './restTest/rest-test-types'

export * from './sdkHelpersModule/src/types'
export type { InitBackendConfig } from './sdkHelpersModule/src/initBackend'

export { parentProcessExitCodes } from './constants'