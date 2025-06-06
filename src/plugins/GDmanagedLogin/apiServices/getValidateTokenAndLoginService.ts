
import { svc } from '../../../service.js'
import { checkOrUpdateEmailOrPasswordRateLimiter, userLoginReturnValidatorRaw } from '../constants.js'
import { decryptValidationToken } from '../decryptValidationTokens.js'
import { db } from '../../../db.js'
import { PluginUserConfig } from '../config.js'
import { userLogin } from '../userLogin.js'
import { objKeys } from 'topkat-utils'
import { _ } from '../../../validator.js'




export function getValidateTokenAndLoginService(pluginConfig: PluginUserConfig) {

  const { loginConfigPerRole } = pluginConfig

  const allEnabledRoles = objKeys(loginConfigPerRole).filter(k => loginConfigPerRole[k].loginOnValidateToken)

  return {
    validateEmailAndLogin: svc({
      for: ['public'],
      input: {
        role: _.enum(allEnabledRoles).required(),
        token: _.string().required(),
        deviceId: _.string().required(),
        deviceType: _.enum(['mobile', 'web']).required(),
        additionalParamsIfSendValidationEmail: _.genericObject('prop', _.any())
      },
      output: _.typesOr([
        _.object({
          ...userLoginReturnValidatorRaw(),
          wasEmailAlreadyValidated: _.false(),
        }).complete(),
        _.object({
          wasEmailAlreadyValidated: _.true(),
        }).complete(),
      ]),
      rateLimiter: checkOrUpdateEmailOrPasswordRateLimiter,
      async main(ctx, { token, deviceId, deviceType, additionalParamsIfSendValidationEmail, role }) {
        const result = await decryptValidationToken(ctx, token, 'emailValidation', pluginConfig)
        if (result.wasEmailAlreadyVerified) {
          return { wasEmailAlreadyValidated: true }
        } else {
          await db.user.update(ctx.GM, result.userId, { isEmailVerified: true })
          return {
            wasEmailAlreadyValidated: false,
            ...(await userLogin(ctx, role, deviceId, deviceType, pluginConfig, result.userId, undefined, additionalParamsIfSendValidationEmail))?.loginInfos,
          }
        }
      },
    })
  }
}