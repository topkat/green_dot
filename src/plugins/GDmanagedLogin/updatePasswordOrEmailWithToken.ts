import { db } from '../../db.js'
import { decryptValidationToken } from './decryptValidationTokens.js'
import { PluginUserConfig } from './config.js'



export async function updatePasswordWithToken(ctx: Ctx, token: string, newPassword: string, pluginConfig: PluginUserConfig) {
  const { user, userId } = await decryptValidationToken(ctx, token, 'forgotPassword', pluginConfig)
  await db.user.update(ctx.GM, userId, { password: newPassword, accessTokens: [], refreshTokens: [] })

  if (!user.isEmailVerified) await db.user.update(ctx.GM, userId, { isEmailVerified: true })
  return user
}

export async function updateEmailWithToken(ctx: Ctx, token: string, pluginConfig: PluginUserConfig) {
  const { user, userId, newEmail } = await decryptValidationToken(ctx, token, 'updateEmail', pluginConfig)
  if (newEmail !== user.newEmail) throw ctx.error.wrongNewEmail({ expectedEmail: user.newEmail, providedEmail: newEmail })
  await db.user.update(ctx.GM, userId, { email: newEmail, newEmail: null })
  return { user, newEmail, oldEmail: user.email }
}