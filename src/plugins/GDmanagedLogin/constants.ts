import { defaultDbName, MainDbName } from '../../cache/dbs/index.generated'
import { RateLimiterConfig } from '../../security/serviceRouteRateLimiter'
import { _ } from '../../validator'



export const emailTypes = ['forgotPassword', 'emailValidation', 'changeEmail'] as const
export type EmailTypes = typeof emailTypes[number]

export const checkOrChangeEmailOrPasswordRateLimiter = {
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