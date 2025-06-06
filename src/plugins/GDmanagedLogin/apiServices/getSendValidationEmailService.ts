import { _ } from '../../../lib/good-cop/src/index.js'
import { svc } from '../../../service.js'
import { db } from '../../../db.js'
import { PluginUserConfig } from '../config.js'
import { credentialManagementMailing } from '../credentialManagementMailing.js'




export function getSendValidationEmailService(pluginConfig: PluginUserConfig) {
  return {
    sendValidationEmail: svc({
      doc: `Send an email to the user for validate their email`,
      for: 'public',
      input: {
        userId: _.string().required(),
        additionalParams: _.genericObject('prop', _.any())
      },
      output: _.string(),
      rateLimiter: '5/min',
      invalidateCacheFor: ['user*'],
      async main(ctx, { userId, additionalParams }) {

        const user = await db.user.getById(ctx.GM, userId)

        if (user) return await credentialManagementMailing(ctx, user, user._id, 'emailValidation', additionalParams, pluginConfig)
        else return 'Validation link sent'
      },
    })
  }
}