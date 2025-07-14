
import { getId } from 'topkat-utils'
import { userLoginReturnValidatorRaw } from './constants.js'
import { _ } from '../../validator.js'
import { MainDbName, ModelTypes } from '../../cache/dbs/index.generated.js'
import { ensureUserIsNotLocked } from '../../security/userAndConnexion/userLockService.js'
import { db } from '../../db.js'
import { comparePasswordAddAttemptAndLockIfNecessary } from './userPasswordService.js'
import { PluginUserConfig } from './config.js'
import { JWTdataWrite, setConnexionTokens } from './userAuthenticationTokenService.js'
import { applyMaskOnObjectForUser } from '../../databases/mongo/services/maskService.js'
import { credentialManagementMailing } from './credentialManagementMailing.js'
import { getMainConfig } from '../../helpers/getGreenDotConfigs.js'




export const userLoginReturnValidator = _.object(userLoginReturnValidatorRaw()).complete()
export type UserLoginReturnValidator = typeof userLoginReturnValidator.tsTypeRead

export async function userLogin<LoginType extends 'phone' | 'email'>(
  ctx: Ctx,
  role: GD['role'],
  deviceId: string,
  deviceType: 'mobile' | 'web',
  pluginConfig: PluginUserConfig,
  loginType: LoginType,
  userOrId?: ModelTypes['user'] | string,
  password?: string,
  additionalParamsIfSendValidationEmail?: Record<string, any>
) {

  const { loginErrorIfEmailIsNotValidated, loginConfigPerRole, loginErrorIfPhoneIsNotValidated } = pluginConfig
  const { defaultDatabaseName } = getMainConfig()

  const user = typeof userOrId === 'string' ? await db.user.getById(ctx.GM, userOrId) : userOrId

  if (user
    && typeof loginConfigPerRole[role]?.additionalLoginPermissionsChecks !== 'undefined'
    && !(await loginConfigPerRole[role]?.additionalLoginPermissionsChecks?.(ctx, user))
  ) {
    throw ctx.error.accessDenied({ fn: 'loginConfigPerRole.additionalLoginPermissionsChecks' })
  }

  // LOCK CHECKS
  await ensureUserIsNotLocked(ctx, user)

  // PASSWORD CHECKS
  if (password) {
    await comparePasswordAddAttemptAndLockIfNecessary(ctx, password, user.password, user)
  }

  await loginConfigPerRole[role]?.onBeforeLogin?.(ctx, role, user)

  // EMAIL VERIFIED CHECK
  if (loginType === 'email' && !user.isEmailVerified && loginErrorIfEmailIsNotValidated === true) {
    await credentialManagementMailing(ctx, user, getId(user), 'emailValidation', additionalParamsIfSendValidationEmail, pluginConfig)
    return {
      isEmailVerified: false,
      userEmail: user.email,
      userId: getId(user),
    } as any as (LoginType extends 'phone' ? { isPhoneVerified: false } : { isEmailVerified: false }) & { userEmail: string, userId: string }
  }
  // PHONE VERIFIED CHECKS
  if (loginType === 'phone' && !user.isPhoneVerified && loginErrorIfPhoneIsNotValidated === true) {
    // TODO should send a validation SMS or equivalent of await credentialManagementMailing(ctx, user, getId(user), 'emailValidation'...
    return {
      isPhoneVerified: false,
      userEmail: user.email,
      userId: getId(user),
    } as any as (LoginType extends 'phone' ? { isPhoneVerified: false } : { isEmailVerified: false }) & { userEmail: string, userId: string }
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

  const tokens = await setConnexionTokens(userCtx, deviceId, toknData, pluginConfig)

  const maskedUser = await applyMaskOnObjectForUser(userCtx, defaultDatabaseName as MainDbName, 'user', 'getOne', user)

  await loginConfigPerRole[role]?.onAfterLogin?.(ctx, role, user, tokens)

  const { accessToken, csrfToken, biometricAuthToken, refreshToken } = tokens

  const obj = (loginType === 'phone' ? { isPhoneVerified: true as const } : { isEmailVerified: true as const }) as LoginType extends 'phone' ? { isPhoneVerified: true } : { isEmailVerified: true }

  return {
    ...obj,
    // isEmailVerified: true,
    // isPhoneVerified: true,
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

