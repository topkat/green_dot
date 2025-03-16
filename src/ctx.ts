

import { getMainConfig } from './helpers/getGreenDotConfigs'
import { ApiOutputTypes } from './types/core.types'
import mongoose from 'mongoose'
import { Request, Response } from 'express'

import { getId } from 'topkat-utils'
import { throwError } from './core.error'
import { dbs } from './db'
import { ModelTypes } from './cache/dbs/index.generated'

import { banUser, addUserWarning } from './security/userAndConnexion/banAndAddUserWarning'

//----------------------------------------
// CTX CLASS
//----------------------------------------
/** `ctx` stores contextual informations about a request like user permissions, paginationData...etc
 * * ctx is scoped to a request and is carried along during all the request lifetime in the backend
 * * That's why `ctx` is used everywhere as the first parameter of 99.9% backend functions
 * */
export class CtxClass {
    /** TODO not actually working Number; 1 or 2 => verbosity */
    debugMode = false
    /** dev, prod, preprod... */
    env = process.env.NODE_ENV
    /** used to cimple check if it's a ctx for sure and not another object */
    isCtx = true as const
    /** Public Ctx means user is not logged */
    isPublic = false
    /** SystemCtx is used by developper 🚸 to bypass all security 🚸 when making a request */
    isSystem = false
    /** Used when no db calls needs to be made but all the process is to be ran */
    simulateRequest = false
    /** Used to store */
    transactionSession?: mongoose.mongo.ClientSession
    /** actual userId or a public | system generic id */
    _id: string = publicUserId
    /** The actual user role as given by the JWT token */
    role: GD['role'] | TechnicalRoles = 'public'
    /** All valid authentication methods used by the user */
    authenticationMethod: Array<AuthenticationMethod | 'apiKey' | 'accessToken'> = []
    /** Used to define through witch platform the ctx is connected, to be overrided by app */
    platform!: string
    /** user stored in the cache */
    _user?: ModelTypes['user']
    /** The actual user permissions fields as given by the JWT token */
    permissions: UserPermissionFields
    /** This is to store the type that will be used in all the for clauses in the app, since in a for you have to provide role. This is not the ideal place to put it, toDo */
    permissionsWithoutRolePermissions!: UserPermissionsWithoutRolePerms
    /** Api request informations */
    api: {
        params: Record<string, any>
        body: Record<string, any>
        originalUrl: string
        query: Record<string, any>
        ipAdress?: string
        req: Request
        res: Response
        /** This is to configure the output type of the api request. Default: json */
        outputType?: ((req: Record<string, any>, ctx: Ctx) => ApiOutputTypes) | ApiOutputTypes
    }
    GM!: typeof this
    /** */
    isFromGeneratedDbApi = false as boolean
    //----------------------------------------
    // CONSTRUCTOR
    //----------------------------------------
    /** NOTE: req object is modified by the constructor */
    constructor(ctx: Ctx)
    constructor(ctxUser: CtxUser, req?: Request, res?: Response, previousCtx?: Ctx)
    constructor(
        ctxUser: CtxUser | Ctx,
        req: Request = {} as Request,
        res: Response = {} as Response,
        previousCtx?: Ctx,
    ) {

        const { env } = getMainConfig()
        if (this.env !== env) this.env = env

        if ('isCtx' in ctxUser) {
            Object.assign(this, ctxUser)
        } else {
            if (previousCtx) Object.assign(this, previousCtx)

            this.api = {
                params: req?.params || {},
                body: req?.body || {},
                originalUrl: req?.originalUrl,
                query: req?.query || {},
                ipAdress: req?.ip,
                req,
                res,
            }

            const { _id, ...restOfCtxUser } = ctxUser

            this._id = _id.toString()

            Object.assign(this, restOfCtxUser)
        }

        if (this.role === 'public') this.isPublic = true
        else if (this.role === 'system') this.isSystem = true

        // TODO THIS SHOULD BE ASYNC CODE with await
        // TODO type override make "this" type not to work
        // events.emit('ctx.creation', this as any)

        return withGodMode(this)
    }
    /** Cleanly throw an error, associating all ctx infos to it (user._id, aplication, service name, route...) */
    throw = new Proxy(
        {} as { [K in keyof GreenDotErrors]: (...params: RemoveFirstElementFromTuple<Parameters<GreenDotErrors[K]>>) => void },
        {
            /** This will inject Ctx (this) as first param of error */
            get: (_, p) => {
                const errorFn = throwError[p]
                if (typeof errorFn === 'function') {
                    return (...args) => { // arrow function here are the trick for keeping this in that context
                        return errorFn.apply(throwError, [
                            this,
                            ...args
                        ])
                    }
                } else return throwError[p] // here all not existing errors are handled by throwError proxy
            },
        })
    //----------------------------------------
    // METHODS
    //----------------------------------------
    /** Use that to change the role used by the actual Ctx, other user permission related fields may be changed at the same time, that's why there is the param fieldsToMergeWithCtxUser */
    useRole(
        role: Ctx['role'],
        permissionsOrUser: Partial<typeof this['permissions']> = {},
        /** default: true; If false, will return the created ctx without modifying the actual one */
        modifyActualCtx = true
    ) {
        return this.fromUser(role, permissionsOrUser, modifyActualCtx)
    }
    async addWarning() {
        const discriminator = this.isSystem || this.isPublic ? this.api.ipAdress : this._id
        return await addUserWarning(this, { discriminator })
    }
    async banUser() {
        const discriminator = this.isSystem || this.isPublic ? this.api.ipAdress : this._id
        return await banUser(this, { discriminator })
    }
    system() {
        if (this.isSystem) return this
        else return this.clone({ ...this, isSystem: true as const, isPublic: false as const, role: 'system' as const })
    }
    /** Check if user has this role
     * system will always return true or false depending on
     * systemAlwaysReturnTrue value (default, false)
     */
    hasRole(
        role: Ctx['role'],
        systemAlwaysReturnTrue = false
    ) {
        if (this.isSystem) return systemAlwaysReturnTrue
        else return this.role === role
    }
    toString() {
        return JSON.stringify(this, null, 2)
    }
    /** Returns the ctx user like it is in database with the permission 'system' (⚠️ with all fields including password and sensitive fields ⚠️) */
    async getUser({
        refreshCache = false,
        errorIfNotSet = true
    } = {}): Promise<ModelTypes['user']> {

        const { defaultDatabaseName } = getMainConfig()

        if (refreshCache === false && this._user) {
            return this._user
        } else {
            return await dbs[defaultDatabaseName].user.getById(this.system(), this._id, { triggerErrorIfNotSet: errorIfNotSet })
        }
    }
    getUserMinimal() {
        return { _id: this._id, role: this.role, premissions: this.permissions }
    }
    clearUserCache() {
        delete this._user
    }
    /** This is to check if the user Id a real logged userId or a generated one corresponding to public or system */
    isAnonymousUser() {
        return !this._id || isAnonymousUser(this._id)
    }
    clone<T extends Record<string, any>>(override: T = {} as any): Ctx & T {
        const newCtx = new CtxClass({ ...this, ...override } as any as Ctx)
        return newCtx as Ctx & T
    }
    /** Build and return or modify Ctx from user fields and role */
    fromUser(role: Ctx['role'], user: Partial<ModelTypes['user']>, modifyActualCtx = true) {

        const { allPermissions } = getMainConfig()

        const newFields = {
            _id: getId(user),
            role,
            isSystem: false,
            isPublic: role === 'public',
            permissions: {} as any,
        } satisfies Partial<Ctx>

        for (const perm of allPermissions) {
            if (user?.[perm]) newFields[perm] = user[perm]
        }

        if (modifyActualCtx) {
            Object.assign(this, newFields)
            return this
        } else {
            return this.clone({ ...this, newFields })
        }
    }

}



//----------------------------------------
// TYPE GLOBAL
//----------------------------------------

declare global {
    interface Ctx extends CtxClass { }
    interface CtxUser {
        _id: Ctx['_id']
        role: Ctx['role']
        permissions: Partial<Ctx['permissions']>
        platform?: Ctx['platform']
        _user?: Ctx['_user']
        authenticationMethod?: Ctx['authenticationMethod']
    }
    interface SystemCtx extends Ctx { isSystem: true, isPublic: false }
    interface PublicCtx extends Ctx { isSystem: false, isPublic: true }
}

//----------------------------------------
// CONSTANTS
//----------------------------------------

export const systemRole = 'system'
export type SystemRole = typeof systemRole
export const publicRole = 'public'
export type PublicRole = typeof publicRole
export const technicalRoles = [systemRole, publicRole] as const
export type TechnicalRoles = typeof technicalRoles[number]
export const systemUserId = '777fffffffffffffffffffff' // same are used in good-cop config
export const publicUserId = '000fffffffffffffffffffff'

export const authenticationMethod = ['biometricAuthToken', 'pincode', '2FA'] as const
export type AuthenticationMethod = typeof authenticationMethod[number]

//----------------------------------------
// HELPERS
//----------------------------------------
/** This is to check if the user Id a real logged userId or a generated one corresponding to public or system */
export const isAnonymousUser = id => [systemUserId, publicUserId].includes(id)

/** adds ctx.GM alias of ctx.system() for god mode */
function withGodMode<T extends CtxClass>(
    ctx: T
): T & { GM: T & { isSystem: true, isPublic: false } } {
    return new Proxy(ctx, {
        get(target, prop) {
            if (prop === 'GM') return withGodMode(ctx.isSystem ? ctx : ctx.system())
            else return target[prop]
        }
    }) as any
}

//----------------------------------------
// INSTANCIATED CTXs
//----------------------------------------
/**
 * Use it when you don't already have access to a ctx from which to do ctx.GM
 */
export function newSystemCtx() {
    return new CtxClass({ role: 'system', _id: systemUserId, permissions: {} }) as SystemCtx
}

/**
 * Use it when you want anonymous user to have a ctx
 */
export function newPublicCtx() {
    return new CtxClass({ role: 'public', _id: publicUserId, permissions: {} }) as PublicCtx
}


export const ctx = newPublicCtx() as Ctx