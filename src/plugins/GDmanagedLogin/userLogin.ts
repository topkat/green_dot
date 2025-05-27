
import { getId } from 'topkat-utils'
import { userLoginReturnValidatorRaw } from './constants'
import { _ } from '../../validator'
import { ModelTypes } from '../../cache/dbs/index.generated'
import { ensureUserIsNotLocked } from '../../security/userAndConnexion/userLockService'
import { db } from '../../db'
import { comparePasswordAddAttemptAndLockIfNecessary } from './userPasswordService'
import { PluginUserConfig } from './main'
import { JWTdataWrite, setConnexionTokens } from './userAuthenticationTokenService'
import { applyMaskOnObjectForUser } from '../../databases/mongo/services/maskService'
import { credentialManagementMailing } from './credentialManagementMailing'




export const userLoginReturnValidator = _.object(userLoginReturnValidatorRaw()).complete()
export type UserLoginReturnValidator = typeof userLoginReturnValidator.tsTypeRead

export async function userLogin(
  ctx: Ctx,
  role: GD['role'],
  deviceId: string,
  deviceType: 'mobile' | 'web',
  pluginConfig: PluginUserConfig,
  userOrId?: ModelTypes['user'] | string,
  password?: string,
  additionalParamsIfSendValidationEmail?: Record<string, any>
) {

  const { loginErrorIfEmailIsNotValidated, loginConfigPerRole } = pluginConfig

  const user = typeof userOrId === 'string' ? await db.user.getById(ctx.GM, userOrId) : userOrId

  if (user && await loginConfigPerRole[role]?.additionalChecks?.(ctx, user)) {
    throw ctx.error.accessDenied({ fn: 'loginConfigPerRole.additionalChecks' })
  }

  // LOCK CHECKS
  await ensureUserIsNotLocked(ctx, user)

  // PASSWORD CHECKS
  if (password) {
    await comparePasswordAddAttemptAndLockIfNecessary(ctx, password, user.password, user)
  }

  await loginConfigPerRole[role]?.onBeforeLogin?.(ctx, role, user)

  // EMAIL VERIFIED CHECK
  if (!user.isEmailVerified && loginErrorIfEmailIsNotValidated === true) {
    await credentialManagementMailing(ctx, user, getId(user), 'emailValidation', additionalParamsIfSendValidationEmail, pluginConfig)
    return {
      isEmailVerified: false,
      userEmail: user.email,
      userId: getId(user),
    }
  }

  // LOGIN
  const userCtx = ctx.clone().useRole(role, user)

  const toknData = {
    deviceId,
    deviceType,
    userId: getId(user),
    role,
    permissions: user, // extra fields will be removed in the token
  } satisfies JWTdataWrite

  const tokens = await setConnexionTokens(userCtx, deviceId, toknData)

  const maskedUser = await applyMaskOnObjectForUser(userCtx, 'bangk', 'user', 'getOne', user)

  await loginConfigPerRole[role]?.onAfterLogin?.(ctx, role, user, tokens)

  const { accessToken, csrfToken, biometricAuthToken, refreshToken } = tokens

  return {
    isEmailVerified: true,
    csrfToken,
    loginInfos: {
      accessToken,
      user: maskedUser,
      deviceId,
      // TODO 129JDIE find a way to simulate prod env and test that this value is not returned
      ...({ refreshToken: ctx.env === 'test' ? refreshToken as any : undefined }),
      csrfToken,
      biometricAuthToken,
    } satisfies UserLoginReturnValidator
  }
}

