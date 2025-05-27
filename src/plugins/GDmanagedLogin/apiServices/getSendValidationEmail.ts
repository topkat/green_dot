import { _ } from 'good-cop'
import { svc } from '../../../service'
import { db } from '../../../db'
import { PluginUserConfig } from '../main'


export async function sendValidationEmail(
  sendEmail: PluginUserConfig['sendEmailToValidateEmailAddress'],
  ...params: Parameters<PluginUserConfig['sendEmailToValidateEmailAddress']>
) {
  const [, user] = params
  if (user) return await sendEmail(...params)
}


export function getSendValidationEmail(
  sendEmail: PluginUserConfig['sendEmailToValidateEmailAddress']
) {
  return svc({
    doc: `Send an email to the user for validating their email. You can send additionalParams that will be forwarded directly to the sendEmail function`,
    for: 'public',
    input: {
      userId: _.string().required(),
      additionalParams: _.genericObject('prop', _.any())
    },
    rateLimiter: '5/min',
    invalidateCacheFor: ['user*'],
    async main(ctx, { userId, additionalParams }) {
      const user = await db.user.getById(ctx.GM, userId)
      await sendValidationEmail(sendEmail, ctx, user, additionalParams)
    },
  })
}