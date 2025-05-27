
import { getId } from 'topkat-utils'
import { svc } from '../../../service'
import { _ } from '../../../validator'
import { db } from '../../../db'
import { PluginUserConfig } from '../main'
import { credentialManagementMailing } from '../credentialManagementMailing'


export function getCredentialManagementServices(
  pluginConfig: PluginUserConfig,
) {
  return {

    //----------------------------------------
    // SEND VALIDATION EMAIL
    //----------------------------------------
    sendEmailToValidateEmailAddress: svc({
      doc: `Send an email to the user for validating their email. You can send additionalParams that will be forwarded directly to the sendEmail function`,
      for: ['ALL', 'public'],
      input: {
        userId: _.string().required(),
        additionalParams: _.genericObject('prop', _.any())
      },
      rateLimiter: '5/min',
      invalidateCacheFor: ['user*'],
      async main(ctx, { userId, additionalParams }) {
        const user = await db.user.getById(ctx.GM, userId)
        await credentialManagementMailing(ctx, user, getId(user), 'emailValidation', additionalParams, pluginConfig)
      },
    }),

    //----------------------------------------
    // FORGOT PASSWORD
    //----------------------------------------
    sendForgotPasswordEmail: svc({
      doc: `Send an email to the user with a link to change his password with "Forgot Password" button in frontend`,
      for: ['ALL', 'public'],
      input: {
        email: _.email().required(),
        additionalParams: _.genericObject('prop', _.any())
      },
      output: _.string(),
      rateLimiter: '5/min',
      async main(ctx, { email, additionalParams }) {
        const user = await db.user.getOne(ctx.GM, { email })
        return await credentialManagementMailing(ctx, user, getId(user), 'forgotPassword', additionalParams, pluginConfig)
      },
    }),


    //----------------------------------------
    // SEND CHANGE EMAIL
    //----------------------------------------
    sendUpdateEmail: svc({
      doc: `Send an email to the new email of the user for validating their email`,
      notFor: ['public'],
      input: {
        newEmail: _.email().required(),
        additionalParams: _.genericObject('prop', _.any())
      },
      output: _.string(),
      invalidateCacheFor: ['user*'],
      async main(ctx, { newEmail, additionalParams }) {
        const user = await ctx.getUser()
        if (newEmail === user.email) throw ctx.error.newEmailSameAsOld()
        return await credentialManagementMailing(ctx, user, getId(user), 'changeEmail', additionalParams, pluginConfig, newEmail)
      },
    }),
  }
}