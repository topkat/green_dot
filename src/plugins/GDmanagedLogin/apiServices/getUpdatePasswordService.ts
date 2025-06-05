import { _ } from 'good-cop'
import { svc } from '../../../service'
import { PluginUserConfig } from '../config'
import { checkOrUpdateEmailOrPasswordRateLimiter } from '../constants'
import { updatePasswordWithToken } from '../updatePasswordOrEmailWithToken'



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