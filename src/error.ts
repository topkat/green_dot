
import { sendErrorViaTelegram } from './services/sendViaTelegram'
import { sendErrorOnTeams } from './services/sendViaTeams'
import { HasKeys } from 'typescript-generic-types'

import { isset, DescriptiveError, ErrorOptions, C, createProxy } from 'topkat-utils'


//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗   ╔══╗ ╦  ╦ ╦╗ ╔ ╔══╗ ══╦══ ═╦═ ╔══╗ ╦╗ ╔ ╔═══
//  ╠═   ╠═╦╝ ╠═╦╝ ║  ║ ╠═╦╝   ╠═   ║  ║ ║╚╗║ ║      ║    ║  ║  ║ ║╚╗║ ╚══╗
//  ╚══╝ ╩ ╚  ╩ ╚  ╚══╝ ╩ ╚    ╩    ╚══╝ ╩ ╚╩ ╚══╝   ╩   ═╩═ ╚══╝ ╩ ╚╩ ═══╝

type ErrorObject = Record<string, ErrorOptions>

const defaultErrors = {} as ErrorObject
const defaultErrorsWithCustomMsg = {} as ErrorObject

/** Throws an error with contextual informations (ctx, custom infos...). Eg: throw error.serverError() */
export const error = createErrorProxy(false) as ThrowErrorTypeSafe // Eg: throw.serverError(message, options)

export const errorWithCtx = createErrorProxy(true) as GreenDotErrors // Add the ctx as first param of the error. Eg: throw.serverError(ctx, message, options)

function createErrorProxy(addCtxFnInParams: boolean) {
    return createProxy({}, {
        get(_, p: string) {
            return (...params) => {

                const ctx = (addCtxFnInParams ? params.shift() || null : null) as Ctx

                let message: string, options: ErrorOptions

                if (defaultErrorsWithCustomMsg[p]) {
                    message = params[0]
                    options = { ...defaultErrorsWithCustomMsg[p], ...(params[1] || {}) }
                } else if (defaultErrors[p]) {
                    message = p + (defaultErrors[p]?.message ? ` ${defaultErrors[p]?.message}` : '')
                    options = { ...defaultErrors[p], ...(params[0] || {}) }
                } else {
                    C.warning(false, `Trying to throw an unknown error "${p}". green_dot errors has not been correctly registered. Generic error thrown instead. Please see documentation on how to throw errors on green_dot or open a github issue.`)
                    message = 'serverError'
                    options = params[0]
                }

                if (typeof options.code === 'undefined') options.code = 422 // default

                const extraInfos = { userId: ctx ? ctx._id : undefined, ...options }

                const error = new DescriptiveError(message, extraInfos)

                setTimeout(() => { // ASYNC
                    // wait for the error to be catched, at this time options.doNotLog can be changed
                    // This is a way to 'undo' any error alerts... in certain cases
                    if (!error.doNotLog && (options.notifyAdmins === true || (options.notifyAdmins === undefined && options.code === 500))) {
                        // NOTIFY ADMINS
                        sendErrorOnTeams(ctx, options.code, message, error, error?.stack?.toString())
                        sendErrorViaTelegram(options.code, message, error?.toString())
                    }
                })
                return error
            }
        },
    })
}


/** This is to register new errors and custom errors and make them available in the project */
export function registerErrors<T extends ErrorObject>(errObj: T, withCustomMsgParam = false) {
    Object.assign(withCustomMsgParam ? defaultErrorsWithCustomMsg : defaultErrors, errObj)
    return errObj
}



//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗   ╦    ═╦═ ╔═══ ══╦══
//  ╠═   ╠═╦╝ ╠═╦╝ ║  ║ ╠═╦╝   ║     ║  ╚══╗   ║
//  ╚══╝ ╩ ╚  ╩ ╚  ╚══╝ ╩ ╚    ╚══╝ ═╩═ ═══╝   ╩

const coreErrors = registerErrors({
    404: { code: 404, message: 'notFound' },
    403: { code: 403, message: 'userDoNotHaveThePermission' },
    422: { code: 422, message: 'wrongParams' },
    401: { code: 401, message: 'accessDenied' },
    409: { code: 401, message: 'conflict' },
    429: { code: 429, message: 'tooManyRequests' },
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

type CoreErrors = RegisterErrorType<typeof coreErrors>
type CoreErrorWithCustomMessage = Record<keyof typeof serverErrors, (ctx: Ctx | null, message: string, extraInfosOrOptions?: ErrorOptions) => void>

export type ThrowErrorTypeSafe = HasKeys<Omit<GreenDotErrors, keyof CoreErrors | keyof CoreErrorWithCustomMessage>> extends true // just in case environement is not application
    ? { [K in keyof GreenDotErrors]: (...params: RemoveFirstElementFromTuple<Parameters<GreenDotErrors[K]>>) => void }
    : Record<string, (...params: [(string | ObjectGeneric)?, ObjectGeneric?]) => any>

declare global {
    interface GreenDotErrors extends CoreErrors { }
    interface GreenDotErrors extends CoreErrorWithCustomMessage { }
}