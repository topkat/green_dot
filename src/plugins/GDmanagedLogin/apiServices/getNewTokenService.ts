




import { db } from '../../../db'
import { getPlugin, getPluginConfig } from '../../pluginSystem'
import { svc } from '../../../service'
import { _ } from '../../../validator'
import { ensureUserIsNotLocked } from '../../../security/userAndConnexion/userLockService'
import { parseToken, revokeToken, setConnexionTokens } from '../userAuthenticationTokenService'


export const getNewTokenService = () => {

    const doubleAuth = getPlugin('GDdoubleAuthentication')
    const { pinCodeLength } = getPluginConfig('GDdoubleAuthentication')

    return {
        getNewToken: svc({
            doc: {
                description: `This route if to renew token periodically after login. Adding an optional pinCode or biometricAuthToken as input allow to use an expired token.`,
                errors: [
                    [404, 'notFound', 'If user do not exist'],
                    [403, 'wrongToken', `May throw for differnet reasons: 'noCookieProvided', 'notSameDevice', 'notExistingToken', 'noTokenRegistered1', 'noTokenRegistered2', 'verifyToken', 'checkTokenDataExists', 'JWTrequiredFields'`],
                    [401, 'tokenExpired'],
                    [401, 'userLocked'],
                    [429, 'tooMuchPinCodeAttempts'],
                    [403, 'wrongPinCode']
                ]
            },
            for: ['public', 'ALL'],
            input: {
                deviceId: _.string().required(),
                pinCode: _.regexp(/^\d+$/).length(pinCodeLength),
                biometricAuthToken: _.string(),
            },
            output: _.object({
                accessToken: _.string(),
                csrfToken: _.string(),
                expirationDate: _.typesOr([_.date(), _.stringConstant('never')]),
                biometricAuthToken: _.string(),
            }).complete(),
            rateLimiter: {
                default: '10/30s',
                test: '200/min',
            },
            async main(ctx, { deviceId, pinCode, biometricAuthToken }) {

                const refreshToken = ctx.api.req?.cookies?.refreshToken || (ctx.env === 'test' && ctx.api.req?.headers?.refreshtoken)

                if (!refreshToken) throw ctx.error.wrongToken({ additionalInfos: 'noCookieProvided' })

                const tokenData = await parseToken(ctx, refreshToken, false)

                const isSameDevice = tokenData.deviceId === deviceId

                if (!isSameDevice) {
                    // provided device infos and token device infos are not the same
                    await revokeToken(ctx, ctx.isPublic ? tokenData.userId : ctx._id, refreshToken)
                    throw ctx.error.wrongToken({ additionalInfos: 'notSameDevice' })
                }

                const user = await db.user.getOne(ctx.GM, { refreshTokens: refreshToken })

                if (user) await ensureUserIsNotLocked(ctx, user)
                else {
                    ctx.api.res.clearCookie('refreshToken')
                    throw ctx.error.wrongToken({ additionalInfos: 'notExistingToken' })
                }

                if (tokenData.expirationDate !== 'never' && tokenData.expirationDate < Date.now()) {
                    // EXPIRED but in case biometric auth or pincode is set we can still use the refresh token
                    if ((pinCode || biometricAuthToken) && doubleAuth) {
                        await doubleAuth.compareAndAddAttempt(ctx, pinCode ? 'pincode' : 'biometricAuthToken', pinCode || biometricAuthToken, user)
                    } else {
                        throw ctx.error.tokenExpired({ phase: 'expiredToken' })
                    }
                }

                const userCtx = ctx.clone().useRole(tokenData.role, user)

                if (user.refreshTokens) {
                    const foundRefreshTkn = user.refreshTokens.find(r => r === refreshToken)
                    if (foundRefreshTkn) {
                        const { accessToken, refreshToken, csrfToken, expirationDate, biometricAuthToken } = await setConnexionTokens(userCtx, deviceId, tokenData)

                        // TODO 129JDIE find a way to simulate prod env and test that this value is not returned
                        return {
                            accessToken,
                            csrfToken,
                            expirationDate,
                            biometricAuthToken,
                            ...({ refreshToken: ctx.env === 'test' || tokenData.deviceType === 'mobile' ? refreshToken as any : undefined }),
                        }
                    } else {
                        throw ctx.error.wrongToken({ additionalInfos: 'noTokenRegistered1' })
                    }
                } else throw ctx.error.wrongToken({ additionalInfos: 'noTokenRegistered2' })
            },
        })
    }
}