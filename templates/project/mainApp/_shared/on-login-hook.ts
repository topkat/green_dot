

import { db, GreenDotAppConfig, env, ctx, error, getUserPermissionFields, ModelTypes } from 'green_dot'
import { permissionPerPlatform, Platforms } from '../../shared/backendConstants'
import { C, objEntries } from 'topkat-utils'

import { parseToken } from '../user/services/userAuthenticationTokenService'
import { ensureUserIsNotLocked } from '../user/services/userLockService'
import { getApiKeys } from './apiKeys'



export const onLoginCallback: GreenDotAppConfig['onLoginCallback'] = async (defaultCtx, req) => {

    const newCtxUser = { ...defaultCtx }
    //----------------------------------------
    // JWT AUTH
    //----------------------------------------
    const authorization = req?.headers?.authorization
    const csrfToken = env.isTest ? 'testCsrf' : req?.cookies?.csrfToken
    const csrfTokenFromHeader = env.isTest ? 'testCsrf' : req.header('X-CSRF-Token')

    let user: ModelTypes['user']

    //     ╦ ╦  ╦ ══╦══   ╔══╗ ╦  ╦ ══╦══ ╦  ╦
    //     ║ ║╔╗║   ║     ╠══╣ ║  ║   ║   ╠══╣
    //  ╚══╝ ╩╝╚╩   ╩     ╩  ╩ ╚══╝   ╩   ╩  ╩
    if (authorization) {
        // Double Submit Cookie Pattern
        // OWASP DOC https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#alternative-using-a-double-submit-cookie-pattern
        if ((csrfToken && csrfTokenFromHeader) || (csrfTokenFromHeader && process.env.NODE_ENV === 'development')) {

            if (csrfToken !== csrfTokenFromHeader && process.env.NODE_ENV !== 'development') throw error.wrongToken({ additionalInfos: `wrong CSRF token` })

            try {
                const { role, userId, permissions } = await parseToken(ctx, authorization)
                if (userId) {
                    // TODO Handle Cache and userId difference
                    user = await db.user.getById(ctx.GM, userId)
                    if (user) {
                        if (user.isLocked) {
                            await ensureUserIsNotLocked(ctx, userId)
                            permissions.isLocked = false
                        }

                        if (!user.accessTokens?.find(accessToken => accessToken === authorization)) {
                            throw error.noAccessToken()
                        }


                        newCtxUser._id = userId

                        const platform = req.headers.platform as Platforms | undefined

                        newCtxUser.role = permissionPerPlatform[platform] || (env.isTest ? role : 'public')

                        newCtxUser._user = user
                        for (const perm of getUserPermissionFields()) {
                            newCtxUser.permissions[perm] = user[perm]
                        }
                        newCtxUser.authenticationMethod.push('accessToken')

                        //  ╔══╗ ╔═╗  ╔═╗  ═╦═ ══╦══ ═╦═ ╔══╗ ╦╗ ╔ ╔══╗ ╦      ╔══╗ ╦  ╦ ══╦══ ╦  ╦
                        //  ╠══╣ ║  ║ ║  ║  ║    ║    ║  ║  ║ ║╚╗║ ╠══╣ ║      ╠══╣ ║  ║   ║   ╠══╣
                        //  ╩  ╩ ╚══╝ ╚══╝ ═╩═   ╩   ═╩═ ╚══╝ ╩ ╚╩ ╩  ╩ ╚══╝   ╩  ╩ ╚══╝   ╩   ╩  ╩

                        ctx.fromUser(newCtxUser.role, newCtxUser, true)

                        const biometricAuthToken = req.header('biometricAuthToken')
                        const pinCode = req.header('pinCode')
                        const _2FA = req.header('_2FA')

                        if (biometricAuthToken) {
                            await secureAuth.compareAndAddAttempt(ctx, 'biometricAuthToken', biometricAuthToken, user)
                            newCtxUser.authenticationMethod.push('biometricAuthToken')
                        }

                        if (pinCode) {
                            await secureAuth.compareAndAddAttempt(ctx, 'pincode', pinCode, user)
                            newCtxUser.authenticationMethod.push('pincode')
                        }

                        if (_2FA) {
                            await secureAuth.compareAndAddAttempt(ctx, '2FA', _2FA, user)
                            newCtxUser.authenticationMethod.push('2FA')
                        }

                    }
                }
            } catch (err) {
                // when wrong token instead of throwing an err, user
                // is connected as public
                const message = err.errorDescription?.message
                if ((message === 'wrongToken' && 'type' in err.options === false) || message === 'noAccessToken') C.error(false, err)
                else throw err
            }
        } else C.error(false, `Missing XCRF token alongside JWT`)
    }

    //  ╔══╗ ╔══╗ ═╦═   ╦ ╔  ╔══╗ ╦   ╦
    //  ╠══╣ ╠══╝  ║    ╠═╩╗ ╠═   ╚═╦═╝
    //  ╩  ╩ ╩    ═╩═   ╩  ╚ ╚══╝   ╩
    if (newCtxUser.role === 'public') {
        const apiKey = req?.headers?.apikey
        const [apiKeyName, apiKeyServer] = objEntries(getApiKeys() || {}).find(([, config]) => config.token === apiKey) || []
        if (apiKey && apiKeyServer) {
            const { _id: userId, role, permissions } = apiKeyServer
            if (role as any === 'system') Object.assign(newCtxUser, ctx.GM)
            else {
                if (userId) newCtxUser._id = userId
                if (role) newCtxUser.role = role
                else if (apiKeyName) newCtxUser.role = apiKeyName as any // TODO
                if (permissions) newCtxUser.permissions = permissions as any
            }
            newCtxUser.authenticationMethod.push('apiKey')
        }
    }

    //  ══╦══ ╔══╗ ╔═══ ══╦══   ╦    ╔══╗ ╔══╗ ═╦═ ╦╗ ╔
    //    ║   ╠═   ╚══╗   ║     ║    ║  ║ ║ ═╦  ║  ║╚╗║
    //    ╩   ╚══╝ ═══╝   ╩     ╚══╝ ╚══╝ ╚══╝ ═╩═ ╩ ╚╩

    // TODO TODO
    // IN TEST ENV we can login simply with specifying a test user name to log with
    // TEST users are defined as CtxUsers
    if (env.isTest) {
        // TODO TODO
    }

    return newCtxUser
}