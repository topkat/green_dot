
import 'typescript-generic-types'
import events from './event'
import sendEmail from './services/sendEmail'
import { error } from './core.error'
import { newSystemCtx, newPublicCtx } from './ctx'
import coreTestFlow from './tests/core.test-flows'
import { unPopulate } from './databases/mongo/services/populateService'
import { service } from './service'


export const allCoreErrors = error
export const coreTestFlows = coreTestFlow

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


export { genericHookInterpreter } from './databases/0_hooks/hookInterpreterGeneric'
export { getApiEndpointsPerRolesFromDao } from './databases/helpers/getApiEndpointsPerRolesFromDao'

export * from './databases/mongo/types/mongoDbTypes'
export * from './security/helpers/parseForClause'
export * from './security/helpers/convertPermsToModelFields'

export type { InferTypeRead, InferTypeWrite, InferType } from 'good-cop/backend'
export { RateLimiterConfig } from './security/serviceRouteRateLimiter'

export { Definition as Definitions } from 'good-cop/backend'

export { makeApiCall } from './services/makeApiCall'

export { _ } from './validator'