import { _ } from '../../../lib/good-cop/index-backend.js'
import { svc } from '../../../service.js'
import { PluginUserConfig } from '../config.js'
import { checkOrUpdateEmailOrPasswordRateLimiter } from '../constants.js'
import { updatePasswordWithToken } from '../updatePasswordOrEmailWithToken.js'



export function getUpdatePasswordService(
  pluginConfig: PluginUserConfig,
) {
  return {
    updatePassword: svc({
      for: ['public'],
      input: {
        token: _.string().required(),
        newPassword: _.password({
          minLength: 8,
          regexp: pluginConfig.passwordRegexp,
          encrypt: async password => password,
        }).required(),
      },
      rateLimiter: checkOrUpdateEmailOrPasswordRateLimiter,
      async main(ctx, { token, newPassword }) {
        const user = await updatePasswordWithToken(ctx.GM, token, newPassword, pluginConfig)
        await pluginConfig.sendPasswordUpdatedMailConfirmation(ctx, user)
      },
    })
  }
}