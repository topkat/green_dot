import { _ } from 'good-cop'
import { db } from '../../../db'
import { PluginUserConfig } from '../config'
import { svc } from '../../../service'
import { checkOrChangeEmailOrPasswordRateLimiter } from '../constants'
import { comparePasswordAddAttemptAndLockIfNecessary } from '../userPasswordService'


export function getUpdateNewPasswordWithOldPassword(
  pluginConfig: PluginUserConfig,
) {
  return {
    updatePasswordWithOldPassword: svc({
      for: ['icoInvestor'],
      input: {
        oldPassword: _.password({
          minLength: 8,
          regexp: pluginConfig.passwordRegexp, /* Make it compatible for user who didn't set any special character in their password*/
          encrypt: async password => password,
        }).required(),
        newPassword: _.password({
          minLength: 8,
          regexp: pluginConfig.passwordRegexp,
          encrypt: async password => password,
        }).required(),
      },
      output: _.string(),
      rateLimiter: checkOrChangeEmailOrPasswordRateLimiter,
      async main(ctx, { oldPassword, newPassword }) {

        const user = await ctx.getUser()
        const passwordInDb = user.password

        if (!await comparePasswordAddAttemptAndLockIfNecessary(ctx, oldPassword, passwordInDb, user)) throw ctx.error.wrongPassword({ passwordRetrialNb: user.passwordRetrialNb })
        if (oldPassword === newPassword) throw ctx.error.newPasswordSameAsOld()

        await db.user.update(ctx.GM, ctx._id, { password: newPassword, accessTokens: [], refreshTokens: [] })

        await pluginConfig.sendPasswordUpdatedMailConfirmation(ctx, user)

        return 'password changed'
      },
    })
  }
}