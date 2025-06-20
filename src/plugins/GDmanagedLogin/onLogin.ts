import { C, objEntries } from 'topkat-utils'
import { ModelTypes } from '../../cache/dbs/index.generated.js'
import { ctx } from '../../ctx.js'
import { db } from '../../db.js'
import { getUserPermissionFields } from '../../helpers/getProjectModelsAndDaos.js'
import { error } from '../../error.js'
import { env } from '../../helpers/getEnv.js'
import { GreenDotAppConfig } from '../../types/appConfig.types.js'
import { parseToken } from './userAuthenticationTokenService.js'
import { ensureUserIsNotLocked } from '../../security/userAndConnexion/userLockService.js'
import { getMainConfig } from '../../helpers/getGreenDotConfigs.js'
import { PluginUserConfig } from './config.js'







export function getOnLoginHandler(
  config: PluginUserConfig
): GreenDotAppConfig['onBeforeLoginCallback'] {
  return async (ctxUser: CtxUser, req) => {
    const { generateSdkConfig } = getMainConfig()
    const permissionPerPlatform = (objEntries(generateSdkConfig.sdkNameForRole as Record<string, string>).reduce((o, [k, v]) => ({ ...o, [v]: k }), {})) as Record<GD['platform'], GD['role']>

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
          const { role, userId, permissions } = await parseToken(ctx, authorization, undefined, config)
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


              ctxUser._id = userId

              const platform = req.headers.platform as GD['platform'] | undefined

              ctxUser.role = permissionPerPlatform[platform as any] || (env.isTest ? role : 'public')

              ctxUser.user = user
              for (const perm of getUserPermissionFields()) {
                ctxUser.permissions[perm] = user[perm]
              }
              ctxUser.authenticationMethod.push('accessToken')

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

  }
}