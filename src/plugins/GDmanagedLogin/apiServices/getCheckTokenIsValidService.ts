import { _ } from 'good-cop'
import { svc } from '../../../service'
import { checkOrChangeEmailOrPasswordRateLimiter, emailTypes } from '../constants'
import { decryptValidationToken } from '../decryptValidationTokens'
import { PluginUserConfig } from '../config'



export function getCheckTokenIsValidService(
  pluginConfig: PluginUserConfig,
) {
  return {
    checkTokenIsValid: svc({
      for: ['ALL', 'public'],
      input: {
        token: _.string().required(),
        emailType: _.enum(emailTypes).required(),
      },
      output: _.object({ isValidToken: _.boolean() }),
      rateLimiter: checkOrChangeEmailOrPasswordRateLimiter,
      async main(ctx, { token, emailType }) {
        await decryptValidationToken(ctx, token, emailType, pluginConfig, true)
        return { isValidToken: true }
      },
    })
  }
}