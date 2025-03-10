
import 'typescript-generic-types'
import events from './event'
import sendEmail from './services/sendEmail'
import { error } from './core.error'
import { newSystemCtx, newPublicCtx } from './ctx'
import coreTestFlow from './tests/core.test-flows'
import { unPopulate } from './databases/mongo/services/populateService'
import { serverConfig } from './cache/green_dot.app.config.cache'
import { service } from './service'


export const allCoreErrors = error
export const coreTestFlows = coreTestFlow
export function getAppConfig() {
    return serverConfig
}

export const core$ = {
    on: events.on,
    off: events.off,
    emit: events.emit,
    emitSync: events.emitSync,
    sendEmail,
    newSystemCtx,
    newPublicCtx,
    unPopulate,
    service,
    svc: service,
}

export { unPopulate } from './databases/mongo/services/populateService'
export * from './startServer'
export * from './generate/generateMainBackendFiles'
export { registerErrors } from './core.error'
export { newSystemCtx, newPublicCtx, CtxClass, isAnonymousUser, systemUserId, publicUserId, technicalRoles, systemRole, publicRole, authenticationMethod } from './ctx'
export * from './types/core.types'
export * as CoreTypes from './types/core.types'
export { loginHookDefault } from './databases/0_hooks/loginHookDefault'
export { applyMaskOnObjectForUser } from './databases/mongo/services/maskService'
export { initDbCache, getDbCache, initDbs } from './databases/initDbInProject'
export { updateServerConfig } from './cache/green_dot.app.config.cache'

export { genericHookInterpreter } from './databases/0_hooks/hookInterpreterGeneric'
export { getApiEndpointsPerRolesFromDao } from './databases/helpers/getApiEndpointsPerRolesFromDao'

export * from './databases/mongo/types/mongoDbTypes'
export * from './security/helpers/parseForClause'
export * from './security/helpers/convertPermsToModelFields'
export { initDbCore, getDbCore } from './databases/initCoreDb'

export type { InferTypeRead, InferTypeWrite, InferType } from 'good-cop/backend'
export { RateLimiterConfig } from './security/serviceRouteRateLimiter'

export { _, Definition as Definitions } from 'good-cop/backend'

export { makeApiCall } from './services/makeApiCall'