

import { db } from '../../db'
import { PluginUserConfig } from './config'
import { ModelTypes } from '../../cache/dbs/index.generated'
import { EmailTypes } from './constants'
import { generateUniqueToken } from '../../services/generateUniqueToken'
import { encryptToken } from '../../security/encryptAndDecryptSafe'


export type CredentialManagementMailingParams = Parameters<typeof credentialManagementMailing>

export async function credentialManagementMailing(
  ctx: Ctx,
  user: ModelTypes['user'],
  userId: string,
  emailType: EmailTypes,
  additionalParams: Record<string, any>,
  pluginConfig: PluginUserConfig,
  newEmail?: string
) {

  //----------------------------------------
  // VERIFICATIONS
  //----------------------------------------
  if (!user || user.isLocked) return 'Validation link sent'
  if (!user.email) throw ctx.error.emailNotSet()

  const tokenValue = generateUniqueToken()

  const encodedToken = encryptToken(userId + '/' + tokenValue + '/' + newEmail)

  const dateNow = Date.now()

  await db.user.update(ctx.GM, user._id, {
    $push: {
      validationTokens: {
        type: emailType,
        value: tokenValue,
        validUntil: new Date(dateNow + 1000 * 60 * pluginConfig.emailTokenTimeValidMinutes),
        creationDate: new Date(dateNow),
      }
    }
  })

  if (emailType === 'changeEmail') {
    await db.user.update(ctx.GM, userId, { newEmail })
  }

  await pluginConfig.sendEmail(ctx, emailType, encodedToken, user, additionalParams, newEmail)

  return ctx.env === 'test' ? encodedToken : 'Validation link sent'
}
