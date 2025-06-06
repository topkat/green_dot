import { _ } from 'good-cop'
import { svc } from '../../../service.js'
import { checkOrUpdateEmailOrPasswordRateLimiter } from '../constants.js'
import { updateEmailWithToken } from '../updatePasswordOrEmailWithToken.js'
import { PluginUserConfig } from '../config.js'


export function getUpdateEmailService(pluginConfig: PluginUserConfig) {
  return {
    updateEmail: svc({
      for: ['ALL', 'public'],
      input: {
        token: _.string().required(),
      },
      rateLimiter: checkOrUpdateEmailOrPasswordRateLimiter,
      invalidateCacheFor: ['user*'],
      async main(ctx, { token }) {
        const props = await updateEmailWithToken(ctx, token, pluginConfig)
        await pluginConfig.sendEmailUpdatedMailConfirmation(ctx, props)
      },
    })
  }
}