import 'typescript-generic-types'
import './types/global.types.js'



export { coreTestSuite } from './tests/core.testSuite.js'

export { svc, schedule } from './service.js'

export { error, type RegisterErrorType, registerErrors } from './error.js'
export { unPopulate } from './databases/mongo/services/populateService.js'
export * from './startServer.js'

export { newSystemCtx, newPublicCtx, CtxClass, isAnonymousUser, systemUserId, publicUserId, technicalRoles, systemRole, publicRole, authenticationMethod, ctx } from './ctx.js'
export * from './types/core.types.js'
export * as CoreTypes from './types/core.types.js'
export { applyMaskOnObjectForUser } from './databases/mongo/services/maskService.js'

export { cliIntro, clearCli, cliBadge } from './cli/helpers/cli.js'

export { genericHookInterpreter } from './databases/0_hooks/hookInterpreterGeneric.js'
export { getApiEndpointsPerRolesFromDao } from './databases/helpers/getApiEndpointsPerRolesFromDao.js'

export * from './databases/mongo/types/mongoDbTypes.js'

// Re-export good-cop types with explicit type exports
export type {
  InferTypeRead,
  InferTypeWrite,
  InferType,
  Definition,
  GenericDef,
  DefinitionPartial,
  DefCtx
} from 'good-cop'

// Export the validator instance
export { _ } from './validator.js'

export { db, dbs, dbCache, type Db, type Dbs } from './db.js'
export { getUserPermissionFields } from './helpers/getProjectModelsAndDaos.js'
export type { ModelTypes, ModelNames, ModelNamesForDb, MainDbName, ModelsWithDbNamesAndReadWrite as AllModelsWithReadWrite } from './cache/dbs/index.generated.js'

export { getActiveAppConfig, getActiveDbConfig, getMainConfig, initMainConfigCache, initClientApp, initEnv } from './helpers/getGreenDotConfigs.js'

export { env } from './helpers/getEnv.js'

export { sendEmail } from './services/sendEmail.js'

export { generateUniqueToken } from './services/generateUniqueToken.js'

// export { init } from './init.js'
export { initDbs } from './db.js'

export { startServer, stopServer } from './startServer.js'

export { assert, testRunner } from './restTest/rest-test.js'
export type { GreenDotApiTestsConfig, TestSuite, TestItem } from './restTest/rest-test-types.js'

export * from './sdkHelpersModule/src/types.js'
export type { InitBackendConfig } from './sdkHelpersModule/src/initBackend.js'

export { parentProcessExitCodes } from './constants.js'


export { addUserWarning, banUser } from './security/userAndConnexion/banAndAddUserWarning.js'
export * from './security/userAndConnexion/userLockService.js'

// TODO this should be a special /plugins exports
export * from './plugins/index.js'
export { getPluginConfig, getPlugin } from './plugins/pluginSystem.js'

export { UserAdditionalFields, UserAdditionalFieldsRead, UserAdditionalFieldsWrite, getUserAdditionalFields } from './security/userAndConnexion/userAdditionalFields.js'
