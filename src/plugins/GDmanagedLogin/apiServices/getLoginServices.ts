import { _ } from '../../../lib/good-cop/index-backend.js'
import { svc } from '../../../service.js'
import { PluginUserConfig } from '../config.js'
import { getPluginConfig } from '../../pluginSystem.js'
import { objKeys } from 'topkat-utils'
import { db } from '../../../db.js'
import { userLogin, userLoginReturnValidator } from '../userLogin.js'
import { RateLimiterConfig } from '../../../security/serviceRouteRateLimiter.js'




export function getLoginServices(
  pluginConfig: PluginUserConfig,
) {

  const { loginConfigPerRole } = pluginConfig
  const doubleAuthConfig = getPluginConfig('GDdoubleAuthentication')

  const enableEmailLoginForRoles = objKeys(loginConfigPerRole).filter(k => loginConfigPerRole[k].emailLogin)
  const enablePhoneLoginForRoles = objKeys(loginConfigPerRole).filter(k => loginConfigPerRole[k].phoneLogin)


  const sharedInputFields = {
    deviceId: _.string().required(),
    deviceType: _.enum(['mobile', 'web']).required(),
    password: _.password({
      minLength: 8,
      //regexp: emailRegexp, /* Make it compatible for user who didn't set any special character in their password */
      encrypt: async password => password,
    }).required(),
    pinCode: _.string().length(doubleAuthConfig.pinCodeLength),
  }

  const rateLimiter = { default: '5/min', test: 'disable' } satisfies RateLimiterConfig


  return {
    loginWithEmail: svc({
      for: ['ALL', 'public'],
      input: {
        email: _.email().required(),
        role: _.enum(enableEmailLoginForRoles).required(),
        ...sharedInputFields
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
      rateLimiter,
      async main(ctx, {
        deviceId,
        deviceType,
        email,
        password,
        role,
      }) {
        const user = await db.user.getOne(ctx.GM, { email }, { triggerErrorIfNotSet: true })
        return await userLogin(ctx, role, deviceId, deviceType, pluginConfig, 'email', user, password)
      },
    }),
    loginWithPhone: svc({
      for: ['ALL', 'public'],
      input: {
        deviceType: _.enum(['mobile', 'web']).required(),
        phoneWithPrefix: _.string().required(),
        role: _.enum(enablePhoneLoginForRoles).required(),
        ...sharedInputFields,
      },
      output: _.typesOr([
        _.object({
          isPhoneVerified: _.true(),
          loginInfos: userLoginReturnValidator
        }).complete(),
        _.object({
          isPhoneVerified: _.false(),
          userId: _.objectId(),
          userEmail: _.email(),
        }).complete(),
      ])
      ,
      rateLimiter,
      async main(ctx, {
        deviceId,
        deviceType,
        phoneWithPrefix,
        password,
        role,
      }) {
        const user = await db.user.getOne(ctx.GM, { phoneWithPrefix }, { triggerErrorIfNotSet: true })
        return await userLogin(ctx, role, deviceId, deviceType, pluginConfig, 'phone', user, password)
      },
    })
  }
}