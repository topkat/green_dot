import { _ } from 'good-cop'
import { svc } from '../../../service'
import { checkOrChangeEmailOrPasswordRateLimiter, emailTypes } from '../constants'
import { decryptValidationToken } from '../decryptValidationTokens'
import { PluginUserConfig } from '../main'
import { getMainConfig } from '../../../helpers/getGreenDotConfigs'
import { getPlugin, getPluginConfig } from '../../pluginSystem'
import { objKeys } from 'topkat-utils'
import { db } from '../../../db'
import { error } from '../../../error'
import { userLogin, userLoginReturnValidator } from '../userLogin'

const loginParamsValidator = _.n('userFields').object().required()

const loginWithEmailReturnType = _.typesOr([
  _.object({
    isEmailVerified: _.true(),
    loginInfos: userLoginReturnValidator
  }).complete(),
  _.object({
    isEmailVerified: _.false(),
    userId: _.objectId(),
    userEmail: _.email(),
  }).complete(),
])


export type LoginWithEmailReturnType = typeof loginWithEmailReturnType['tsTypeRead']




export function getLoginServices(
  pluginConfig: PluginUserConfig,
) {

  const mainConfig = getMainConfig()
  const { loginConfigPerRole } = pluginConfig
  const doubleAuthConfig = getPluginConfig('GDdoubleAuthentication')

  const allEnabledRoles = objKeys(loginConfigPerRole).filter(k => loginConfigPerRole[k].emailLogin)

  return {
    loginWithEmail: svc({
      for: ['ALL', 'public'],
      input: {
        role: _.enum(allEnabledRoles).required(),
        deviceId: _.string().required(),
        deviceType: _.enum(['mobile', 'web']).required(),
        email: _.email().required(),
        password: _.password({
          minLength: 8,
          //regexp: emailRegexp, /* Make it compatible for user who didn't set any special character in their password */
          encrypt: async password => password,
        }).required(),
        pinCode: _.string().length(doubleAuthConfig.pinCodeLength),
      },
      output: _.typesOr([
        _.object({
          isEmailVerified: _.true(),
          loginInfos: userLoginReturnValidator
        }).complete(),
        _.object({
          isEmailVerified: _.false(),
          userId: _.objectId(),
          userEmail: _.email(),
        }).complete(),
      ])
      ,
      rateLimiter: {
        default: '5/min',
        test: 'disable',
      },
      async main(ctx, {
        deviceId,
        deviceType,
        email,
        password,
        role,
      }) {
        const user = await db.user.getOne(ctx.GM, { email }, { triggerErrorIfNotSet: true })

        if (user && await loginConfigPerRole[role]?.additionalChecks?.(ctx, user)) {
          throw ctx.error.accessDenied()
        }

        await loginConfigPerRole[role]?.onLogin?.(ctx, role, user)

        return await userLogin(ctx, role, deviceId, deviceType, pluginConfig, user, password)
      },
    })
  }
}
