import { _ } from 'good-cop'
import { svc } from '../../../service.js'
import { checkOrUpdateEmailOrPasswordRateLimiter, gdManagedLoginEmailTypes } from '../constants.js'
import { decryptValidationToken } from '../decryptValidationTokens.js'
import { PluginUserConfig } from '../config.js'



export function getCheckTokenIsValidService(
  pluginConfig: PluginUserConfig,
) {
  return {
    checkTokenIsValid: svc({
      for: ['ALL', 'public'],
      input: {
        token: _.string().required(),
        emailType: _.enum(gdManagedLoginEmailTypes).required(),
      },
      output: _.object({ isValidToken: _.boolean() }),
      rateLimiter: checkOrUpdateEmailOrPasswordRateLimiter,
      async main(ctx, { token, emailType }) {
        await decryptValidationToken(ctx, token, emailType, pluginConfig, true)
        return { isValidToken: true }
      },
    })
  }
}