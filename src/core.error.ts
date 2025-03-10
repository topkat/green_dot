

import { sendErrorViaTelegram } from './services/sendViaTelegram'
import { sendErrorOnTeams } from './services/sendViaTeams'

import { isset, DescriptiveError, ErrorOptions } from 'topkat-utils'


export const error = {
    ...registerErrors({
        404: { code: 404, msg: 'notFound' },
        403: { code: 403, msg: 'userDoNotHaveThePermission' },
        422: { code: 422, msg: 'wrongParams' },
        401: { code: 401, msg: 'accessDenied' },
        409: { code: 401, msg: 'conflict' },
        429: { code: 429, msg: 'tooManyRequests' },
        // DATA VALIDATION
        ressourceDoesNotExists: { code: 404 },
        accessDenied: { code: 403 },
        duplicateRessource: { code: 409 },
        methodForbiddenForModel: { code: 403 },
        _idFieldMustBeSetWhenBatchUpdate: { code: 422 },
        requiredFieldsNotSet: { code: 422 },
        requiredVariableEmptyOrNotSet: { code: 422 },
        requiredVariableEmpty: { code: 422 },
        wrongTypeForVar: { code: 422 },
        wrongValueForParam: { code: 422 },
        modelDoNotExist: { code: 422 },
        functionDoNotExistInModel: { code: 422 },
        // SERVICES
        scheduleError: { code: 500 },
        sendEmailError: { code: 500 },
        // PERMISSIONS
        unauthorizedMethod: { code: 403 },
        tooManyRequests: { code: 429 },
        actionHasBeenRejectedByHasAccessHook: { code: 403 },
        // CONNEXION
        authenticationFailed: { code: 401 },
        wrongPassword: { code: 401 },
        wrongToken: { code: 401 },
        noAccessToken: { code: 401 },
        userDoNotHaveThePermission: { code: 403 },
        tokenExpired: { code: 401 },
        filterWithMongoOperatorsNotAllowed: { code: 422 },
        secureAuthenticationRequired: { code: 403 }
    }),
    serverError: coreErrorWithMsg({ code: 500 }),
    applicationError: coreErrorWithMsg({ code: 422 }),
}

/** Standard error Eg: throw.myError(ctx, options). Here `myError` will be the message */
function coreError(optionsBase: ErrorOptions = {}) {
    return (ctx: Ctx | null, options: ErrorOptions = {}) => {
        const msg = options?.errMsgId || optionsBase?.msg || optionsBase?.message
        return sharedErrorEndpoint(ctx, msg, { ...optionsBase, ...options })
    }
}

/** Output an error witha a CUSTOM MESSAGE. Eg: throw.myError(ctx, msg, options) */
function coreErrorWithMsg(optionsBase: ErrorOptions = {}) {
    return (ctx: Ctx | null, msg: string, options: ErrorOptions = {}) => {
        return sharedErrorEndpoint(ctx, msg, { ...optionsBase, ...options })
    }
}

function sharedErrorEndpoint(ctx: Ctx | null, msg: string, options: ErrorOptions = {}) {
    const infosFromCtx = ctx && ctx._id ? { userId: ctx._id } : {}
    const extraInfos = { ...infosFromCtx, ...options }
    const error = new DescriptiveError(msg, extraInfos)
    if (!isset(options.code)) options.code = 422 // default
    setTimeout(() => { // ASYNC
        // wait for the error to be catched, at this time options.doNotLog can be changed
        if (!error.doNotLog && (options.notifyAdmins === true || (options.notifyAdmins === undefined && options.code === 500))) {
            // NOTIFY ADMINS
            sendErrorOnTeams(ctx, options.code || 500, msg, error, error?.stack?.toString())
            sendErrorViaTelegram(options.code, msg, error?.toString())
        }
    })
    if (options.doNotThrow !== true) throw error
    else return error
}


/** This is to register new errors and custom errors */
export function registerErrors<T extends Record<string, ErrorOptions>>(errObj: T) {
    const output = {} as Record<keyof T, ReturnType<typeof coreError>>
    for (const [errName, errOptions] of Object.entries(errObj)) {
        output[errName as keyof T] = coreError({ msg: errName, ...errOptions })
    }
    return output
}