import { _ } from 'good-cop'
import { svc } from '../../../service'
import { checkOrChangeEmailOrPasswordRateLimiter, userLoginReturnValidatorRaw } from '../constants'
import { decryptValidationToken } from '../decryptValidationTokens'
import { db } from '../../../db'
import { PluginUserConfig } from '../main'
import { userLogin } from '../userLogin'




export function getValidateTokenAndLoginService(
  pluginConfig: PluginUserConfig,
) {
  return {
    validateEmailAndLogin: svc({
      for: ['public'],
      input: {
        token: _.string().required(),
        deviceId: _.string().required(),
        deviceType: _.enum(['mobile', 'web']).required(),
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
      rateLimiter: checkOrChangeEmailOrPasswordRateLimiter,
      async main(ctx, { token, deviceId, deviceType }) {
        const result = await decryptValidationToken(ctx, token, 'emailValidation', pluginConfig.sendEmailToValidateEmailAddress)
        if (result.wasEmailAlreadyVerified) {
          return { wasEmailAlreadyValidated: true }
        } else {
          await db.user.update(ctx.GM, result.userId, { isEmailVerified: true })
          return {
            wasEmailAlreadyValidated: false,
            ...(await userLogin(ctx, pluginConfig.mainRoleForConnexion, deviceId, deviceType, pluginConfig, result.userId))?.loginInfos,
          }
        }
      },
    })
  }
}