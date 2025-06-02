import { _ } from 'good-cop'
import { svc } from '../../../service'
import { PluginUserConfig } from '../config'
import { getPluginConfig } from '../../pluginSystem'
import { objKeys } from 'topkat-utils'
import { db } from '../../../db'
import { userLogin, userLoginReturnValidator } from '../userLogin'




export function getLoginServices(
  pluginConfig: PluginUserConfig,
) {

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
        return await userLogin(ctx, role, deviceId, deviceType, pluginConfig, user, password)
      },
    })
  }
}
