

import jwt from 'jsonwebtoken'
import { getActiveAppConfig, getMainConfig } from '../../helpers/getGreenDotConfigs'

import { generateUniqueToken } from '../../services/generateUniqueToken'
import { db } from '../../db'
import { ModelTypes } from '../../cache/dbs/index.generated'
import { setCsrfTokenCookie, setRefreshTokenCookie } from './cookieService'
import { getPluginConfig } from '../../plugins/pluginSystem'
import { decryptToken, encryptToken } from '../../security/encryptAndDecryptSafe'




//----------------------------------------
// USER AUTHENTICATION
//----------------------------------------
//
// user login with email + password + uniqueDeviceId
// he gets back accessToken and refreshToken
// on each login, we create a new refresh token and delete the previous one
// a total of 2 refresh tokens can be active at the same time (so 2 devices)
// accessToken can live up to one hour

export type JWTdataBase = {
    type: 'access' | 'refresh'
    deviceId: string
    deviceType: 'mobile' | 'web',
    /** a date in the future */
    expirationDate: number | 'never'
}

export type JWTdata = JWTdataBase & Omit<CtxUser, '_id' | 'role'> & { userId: string, role: GD['role'] | 'public' }

export type JWTdataWrite = Omit<JWTdata, 'expirationDate' | 'type'>

type JWTdataObfuscated = JWTdataBase & { d: string } // d is used to store userId, role and perms in a compressed way

export async function createToken(
    ctx: Ctx,
    data: Omit<JWTdata, 'expirationDate'>
) {

    const appConfig = await getActiveAppConfig()

    const { jwtRefreshExpirationMsMobile, jwtRefreshExpirationMsWeb, jwtSecret } = appConfig

    if (data.role === 'public') throw ctx.error.serverError('noTokenIsAllowedWithRolePublic')
    const expireInMs = data.type === 'access' ? appConfig.jwtExpirationMs /** do not spread */ : data.deviceType === 'web' ? jwtRefreshExpirationMsWeb : jwtRefreshExpirationMsMobile
    const expirationDate = expireInMs === 'never' ? expireInMs : Date.now() + expireInMs

    const { userId, role, permissions, ...otherFields } = data

    const jwtData: JWTdataObfuscated = { ...otherFields, expirationDate, d: encryptPermsInJwt(userId, role, permissions) }
    const originalJwt = jwt.sign(jwtData, jwtSecret)
    return {
        token: await encryptToken(originalJwt),
        expirationDate: expirationDate !== 'never' ? new Date(expirationDate) : expirationDate
    }
}

/** Parse token and throw errors if:
 * * wrong token
 * * expired token
 * * wrong token data format
 */
export async function parseToken(
    ctx: Ctx,
    token: string,
    checkExpiredToken = true
) {
    let data: JWTdata | undefined

    const appConfig = await getActiveAppConfig()
    const { jwtSecret } = appConfig

    const requiredTokenFields = ['type', 'userId', 'deviceId', 'expirationDate']

    try {
        const { d, ...otherFields } = jwt.verify(decryptToken(ctx, token), jwtSecret) as JWTdataObfuscated
        const { _id, permissions, role } = decryptPermInJwt(d)

        data = {
            userId: _id,
            permissions,
            role: role as GD['role'],
            ...otherFields
        }

    } catch (err) {
        throw ctx.error.wrongToken({ phase: 'verifyToken' })
    }

    if (!data) throw ctx.error.wrongToken({ phase: 'checkTokenDataExists' })
    else if (!requiredTokenFields.every(reqFld => !!data[reqFld])) throw ctx.error.wrongToken({ phase: 'JWTrequiredFields' })
    else if (checkExpiredToken && data.expirationDate !== 'never' && typeof data.expirationDate === 'number' && data.expirationDate < Date.now()) throw ctx.error.tokenExpired({ phase: 'expiredToken' })

    return data
}

/** This function will:
 * * GENERATE TOKENS
 * * DELETE PREVIOUS TOKEN ASSOCIATED WITH THIS DEVICEID
 * * CREATE AND UPDATE USER REFRESH TOKEN AND ACCESS TOKEN LIST
 * * PUT TOKEN IN COOKIE
 */
export async function setConnexionTokens(
    ctx: Ctx,
    deviceId: string,
    tokenData: JWTdataWrite,
) {

    const user = await ctx.getUser()

    const previousRefreshTokenList = user.refreshTokens
    const previousAccessTokenList = user.accessTokens

    const { maxRefreshTokenPerRole } = getPluginConfig('GDmanagedLogin')

    const { role } = tokenData
    // GENERATE TOKENS
    const { token: refreshToken, expirationDate } = await createToken(ctx, { ...tokenData, type: 'refresh' })
    const { token: accessToken } = await createToken(ctx, { ...tokenData, type: 'access' })
    const csrfToken = generateUniqueToken(24) // Simple Session Token
    const biometricAuthToken = generateUniqueToken(24) // biometric auth token

    //KEEP THE LATEST TOKENS

    const refreshTokenListWithoutPrevious = getTokenListWithoutPrevious(ctx, previousRefreshTokenList, deviceId, role, maxRefreshTokenPerRole[role] || 3)
    const accessTokenListWithoutPrevious = getTokenListWithoutPrevious(ctx, previousAccessTokenList, deviceId, role, maxRefreshTokenPerRole[role])

    await db.user.update(ctx.GM, ctx._id, {
        refreshTokens: [...refreshTokenListWithoutPrevious, refreshToken],
        accessTokens: [...accessTokenListWithoutPrevious, accessToken],
        biometricAuthToken,
    })

    setRefreshTokenCookie(ctx, refreshToken)
    setCsrfTokenCookie(ctx, csrfToken)

    return {
        refreshToken,
        accessToken,
        expirationDate,
        csrfToken,
        biometricAuthToken,
    }
}

function getTokenListWithoutPrevious(
    ctx: Ctx,
    previousTokenList: Array<string>,
    deviceId: string,
    role: Parameters<typeof setConnexionTokens>[2]['role'],
    maxTokenListLength: number
) {

    let tokenNbSessionsLeftForRole = maxTokenListLength - 1

    return previousTokenList.reverse().filter(async tkn => {
        try {
            const data = await parseToken(ctx, tkn)
            // FILTER OUT PREVIOUS TOKEN ASSOCIATED WITH THIS DEVICEID
            const isSameDeviceAndRole = data.deviceId === deviceId && data.role === role
            // OR TOKENS ABOVE MAX SESSIONS
            const isAboveMaxSession = !isSameDeviceAndRole && data.role === role && tokenNbSessionsLeftForRole-- === 0
            return !isSameDeviceAndRole && !isAboveMaxSession
        } catch (error) { // it may happens on server update
            return false
        }
    }).reverse()
}



/** Revoke a particular user token so it can't be used to login anymore. Note
that all accessTokens can still be used until peremtion date */
export async function revokeToken(ctx: Ctx, userId: string, token: string, tokenName: 'refreshTokens' | 'accessTokens' = 'refreshTokens', user?: ModelTypes['user']) {
    if (!user) user = await db.user.getById(ctx.GM, userId)
    const newTokens = user?.[tokenName]?.filter(t => t !== token)
    return newTokens ? await db.user.update(ctx.GM, userId, {
        [tokenName]: newTokens
    }) : null
}






//----------------------------------------
// COMPRESS PERMISSIONS
//----------------------------------------

/** This one is to transform the actual user perms that will be carried along in the JWT for it to be compressed and obfuscated */
function encryptPermsInJwt(_id: string, role: GD['role'], permissions: Partial<Ctx['permissions']>) {

    const { allRoles, allPermissions = [] } = getMainConfig()

    let encodedStr = _id + '.' + allRoles.indexOf(role as any) + '.'
    for (const permName of allPermissions) {
        const permVal = permissions[permName]
        encodedStr += permVal === true ? 1 : permVal === false ? 2 : 0
    }
    return encodedStr
}

function decryptPermInJwt(jwt: string) {

    const { allRoles, allPermissions = [] } = getMainConfig()

    const [_id, roleIndex, permStr] = jwt.split('.') || []

    const ctxUser: Partial<CtxUser> = {
        _id,
        role: allRoles[roleIndex] || 'public',
        permissions: {} as any
    }

    const permsNum = permStr.split('')
    permsNum.forEach((num: '0' | '1' | '2', i) => {
        const correspondingPerm = allPermissions[i]
        ctxUser.permissions[correspondingPerm] = num === '1' ? true : num === '2' ? false : undefined
    })
    return ctxUser
}