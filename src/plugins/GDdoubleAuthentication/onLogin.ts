
import { ctx } from '../../ctx.js'
import { GreenDotAppConfig } from '../../types/appConfig.types.js'
import type { GDdoubleAuthentication } from './main.js'




export function getOnLogin(gdDoubleAuth: GDdoubleAuthentication): GreenDotAppConfig['onLoginCallback'] {
  return async (ctxUser: CtxUser, req) => {

    const { user } = ctxUser

    if (!user) {

      ctx.fromUser(ctxUser.role, user, true)

      const biometricAuthToken = req.header('biometricAuthToken')
      const pinCode = req.header('pinCode')
      const _2FA = req.header('_2FA')

      if (biometricAuthToken) {
        await gdDoubleAuth.compareAndAddAttempt(ctx, 'biometricAuthToken', biometricAuthToken, user)
        ctxUser.authenticationMethod.push('biometricAuthToken')
      }

      if (pinCode) {
        await gdDoubleAuth.compareAndAddAttempt(ctx, 'pincode', pinCode, user)
        ctxUser.authenticationMethod.push('pincode')
      }

      if (_2FA) {
        await gdDoubleAuth.compareAndAddAttempt(ctx, '2FA', _2FA, user)
        ctxUser.authenticationMethod.push('2FA')
      }
    }
  }
}
