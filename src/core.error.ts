

import { sendErrorViaTelegram } from './services/sendViaTelegram'
import { sendErrorOnTeams } from './services/sendViaTeams'

import { isset, DescriptiveError, ErrorOptions, C } from 'topkat-utils'


//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗   ╔══╗ ╦  ╦ ╦╗ ╔ ╔══╗ ══╦══ ═╦═ ╔══╗ ╦╗ ╔ ╔═══
//  ╠═   ╠═╦╝ ╠═╦╝ ║  ║ ╠═╦╝   ╠═   ║  ║ ║╚╗║ ║      ║    ║  ║  ║ ║╚╗║ ╚══╗
//  ╚══╝ ╩ ╚  ╩ ╚  ╚══╝ ╩ ╚    ╩    ╚══╝ ╩ ╚╩ ╚══╝   ╩   ═╩═ ╚══╝ ╩ ╚╩ ═══╝


export const throwError = new Proxy({}, {
    get(target, p) {
        // This ensure that in all case an error is thrown, even the error is not registered
        if (p in target == false) C.error(false, 'Unknown error ' + (p as string) + '. Error has not been correctly registered.')
        return (...params) => {
            const [additionalMsg, options] = Object.keys(serverErrors).includes(p as string) ? params : ['', ...params]
            // INJECT CTX since we probably are in a context where ctx is not available. If not ctx.throw is preferred
            return getThrowErrorFn({ msg: (p as string) + (additionalMsg ? '\n> ' + additionalMsg : '') })(null, options)
        }
    },
}) as ThrowErrorTypeSafe

/** This is to register new errors and custom errors and make them available in the project */
export function registerErrors<T extends Record<string, ErrorOptions>>(errObj: T, withCustomMsgParam = false) {
    for (const [errName, errOptions] of Object.entries(errObj)) {
        if (withCustomMsgParam) {
            // Error with a a CUSTOM MESSAGE. Eg: throw.myError(ctx, msg, options)
            throwError[errName] = ((ctx: Ctx | null, msg: string, options: ErrorOptions = {}) => {
                return sharedErrorEndpoint(ctx, msg, { ...errOptions, ...options })
            }) as any // TODO needs simplification
        } else {
            // Classic error. Eg: throw.myError(ctx, options)
            throwError[errName] = getThrowErrorFn(errOptions)
        }
    }
    return errObj
}

function getThrowErrorFn(errOptionsToMerge: ErrorOptions) {
    return (ctx: Ctx | null, options: ErrorOptions = {}) => {
        return sharedErrorEndpoint(ctx, options?.errMsgId || errOptionsToMerge?.msg || errOptionsToMerge?.message, { ...errOptionsToMerge, ...options })
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

//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗   ╦    ═╦═ ╔═══ ══╦══
//  ╠═   ╠═╦╝ ╠═╦╝ ║  ║ ╠═╦╝   ║     ║  ╚══╗   ║
//  ╚══╝ ╩ ╚  ╩ ╚  ╚══╝ ╩ ╚    ╚══╝ ═╩═ ═══╝   ╩

const coreErrors = registerErrors({
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
} as const)

const serverErrors = registerErrors({
    serverError: { code: 500 },
    applicationError: { code: 422 },
    500: { code: 500 },
} as const, true)

//  ╔══╗ ╦  ╦ ╔══╗ ╦╗╔╦ ╔══╗ ╦╗ ╔ ══╦══   ╔══╗ ╦    ╔══╗ ╔═╗  ╔══╗ ╦      ══╦══ ╦   ╦ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ║  ║ ║ ═╦ ║╚╝║ ╠═   ║╚╗║   ║     ║ ═╦ ║    ║  ║ ╠═╩╗ ╠══╣ ║        ║   ╚═╦═╝ ╠══╝ ╠═   ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩  ╩ ╚══╝ ╩ ╚╩   ╩     ╚══╝ ╚══╝ ╚══╝ ╚══╝ ╩  ╩ ╚══╝     ╩     ╩   ╩    ╚══╝ ═══╝

export type RegisterErrorType<T extends Record<string, any>> = Record<keyof T, (ctx: Ctx | null, extraInfosOrOptions?: ErrorOptions) => void>

export type CoreErrors = RegisterErrorType<typeof coreErrors>
export type CoreErrorWithCustomMessage = Record<keyof typeof serverErrors, (ctx: Ctx | null, message: string, extraInfosOrOptions?: ErrorOptions) => void>

export type ThrowErrorTypeSafe = HasKeys<Omit<GreenDotErrors, keyof CoreErrors | keyof CoreErrorWithCustomMessage>> extends true // just in case environement is not application
    ? { [K in keyof GreenDotErrors]: (...params: RemoveFirstElementFromTuple<Parameters<GreenDotErrors[K]>>) => void }
    : Record<string, (...params: [(string | ObjectGeneric)?, ObjectGeneric?]) => any>

declare global {
    interface GreenDotErrors extends CoreErrors { }
    interface GreenDotErrors extends CoreErrorWithCustomMessage { }
}
