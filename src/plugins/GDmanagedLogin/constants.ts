import { defaultDbName, MainDbName } from '../../cache/dbs/index.generated.js'
import { RateLimiterConfig } from '../../security/serviceRouteRateLimiter.js'
import { _ } from '../../validator.js'



export const gdManagedLoginEmailTypes = ['forgotPassword', 'emailValidation', 'updateEmail'] as const
export type GDmanagedLoginEmailTypes = typeof gdManagedLoginEmailTypes[number]

export const checkOrUpdateEmailOrPasswordRateLimiter = {
  default: '7/min',
  test: '100/min',
} satisfies RateLimiterConfig


export const userLoginReturnValidatorRaw = () => {
  return {
    user: _.model(defaultDbName as MainDbName, 'user'),
    accessToken: _.string(),
    deviceId: _.string(),
    csrfToken: _.string(),
    biometricAuthToken: _.string(),
  }
}