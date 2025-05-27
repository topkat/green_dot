




import { db } from '../../db'
import { decryptToken } from '../../security/encryptAndDecryptSafe'
import { sendValidationEmail } from './apiServices/getSendValidationEmail'
import { EmailTypes } from './constants'
import { PluginUserConfig } from './main'





export async function decryptValidationToken(
  sendEmail: PluginUserConfig['sendEmailToValidateEmailAddress'],
  ctx, token: string, emailType: EmailTypes, isForVerification = false
) {

  const decryptedToken = decryptToken(ctx, token)
  const [userId, validationTokenId, newEmail] = decryptedToken.split('/')

  if (!decryptedToken.includes('/') || userId.length !== 24) throw ctx.error.wrongToken({ phase: 1 })

  const user = await db.user.getOne(ctx.GM, {
    _id: userId,
  }, { triggerErrorIfNotSet: true })

  if (user.isEmailVerified === true && emailType === 'emailValidation') return { wasEmailAlreadyVerified: true as const }

  const validationToken = user.validationTokens.find(t => t.value === validationTokenId)

  if (!validationToken) throw ctx.error.wrongToken() // no additional infos here

  if (!validationToken.type || validationToken.type !== emailType) {
    throw ctx.error.invalidCheckEmailToken({ token, additionalMessage: `you can't use this token to ${emailType}` })
  }

  if (new Date(validationToken.validUntil) < new Date(Date.now())) {
    if (emailType === 'emailValidation') {
      // resend a mail in case it's expired
      const allTokensTypeExceptEmailValidation = user.validationTokens.map(t => { if (t.type !== 'emailValidation') return t })
      await db.user.update(ctx.GM, userId, { validationTokens: allTokensTypeExceptEmailValidation })

      await sendValidationEmail(sendEmail, ctx.GM, user, { userId })
    }
    throw ctx.error.tokenExpired({ token, email: user.email, _id: userId })
  }

  if (!isForVerification) {
    const newValidationTokens = user.validationTokens.map(t => { if (t.value !== validationToken.value) return t })
    await db.user.update(ctx.GM, userId, { validationTokens: newValidationTokens })
  }

  return {
    wasEmailAlreadyVerified: false as const,
    validationToken,
    user,
    userId,
    newEmail
  }
}