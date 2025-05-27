import { RateLimiterConfig } from '../../security/serviceRouteRateLimiter'



export const emailTypes = ['forgotPassword', 'emailValidation', 'changeEmail'] as const
export type EmailTypes = typeof emailTypes[number]

export const checkOrChangeEmailOrPasswordRateLimiter = {
  default: '7/min',
  test: '100/min',
} satisfies RateLimiterConfig

