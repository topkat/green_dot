import { db } from '../../db'
import { decryptValidationToken } from './decryptValidationTokens'
import { PluginUserConfig } from './main'



export async function updatePasswordWithToken(ctx: Ctx, token: string, newPassword: string, pluginConfig: PluginUserConfig) {
  const { user, userId } = await decryptValidationToken(ctx, token, 'forgotPassword', pluginConfig)
  await db.user.update(ctx.GM, userId, { password: newPassword, accessTokens: [], refreshTokens: [] })

  if (!user.isEmailVerified) await db.user.update(ctx.GM, userId, { isEmailVerified: true })
  return user
}

export async function updateEmailWithToken(ctx: Ctx, token: string, pluginConfig: PluginUserConfig) {
  const { user, userId, newEmail } = await decryptValidationToken(ctx, token, 'changeEmail', pluginConfig)
  if (newEmail !== user.newEmail) throw ctx.error.wrongNewEmail({ expectedEmail: user.newEmail, providedEmail: newEmail })
  await db.user.update(ctx.GM, userId, { email: newEmail, newEmail: null })
  return { user, newEmail, oldEmail: user.email }
}