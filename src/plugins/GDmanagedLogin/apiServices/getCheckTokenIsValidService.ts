import { _ } from 'good-cop'
import { svc } from '../../../service'
import { checkOrChangeEmailOrPasswordRateLimiter, emailTypes } from '../constants'
import { decryptValidationToken } from '../decryptValidationTokens'
import { PluginUserConfig } from '../main'


export function getCheckTokenIsValidService(
  sendEmail: PluginUserConfig['sendEmailToValidateEmailAddress'],
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
        await decryptValidationToken(sendEmail, ctx, token, emailType, true)
        return { isValidToken: true }
      },
    })
  }
}