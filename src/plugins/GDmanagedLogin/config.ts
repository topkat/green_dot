
import { ModelTypes } from '../../cache/dbs/index.generated'
import { EmailTypes } from './constants'
import { setConnexionTokens } from './userAuthenticationTokenService'





export type GDmanagedLoginLoginConfig = {
  emailLogin: boolean
  loginOnValidateToken?: boolean
  /** Returning false will throw an accessDenied error with no other infos. If you want more control over error thrown, extraInfos, alerts..etc, use onLogin  */
  additionalChecks?(ctx: Ctx, user: ModelTypes['user'])
  /** This will be triggered before all other checks */
  onBeforeLogin?(ctx: Ctx, requestedRole: GD['role'], user: ModelTypes['user'])
  /** This will be triggered once login is successful */
  onAfterLogin?(ctx: Ctx, requestedRole: GD['role'], user: ModelTypes['user'], loginTokens: Awaited<ReturnType<typeof setConnexionTokens>>)
}

export type GDmanagedLoginSendEmailUpdatedMailConfirmationFunction = (ctx: Ctx, props: { user: ModelTypes['user'], newEmail: string, oldEmail: string }) => any

export type GDmanagedLoginSendEmailFunction = (
  ctx: Ctx,
  emailType: EmailTypes,
  encodedToken: string,
  user: ModelTypes['user'],
  /** Thoses can be optionnaly passed in frontend in the SDK and will be forwarded to the function  */
  additionalParams: Record<string, any>,
  /** In case emailType is changeEmail, this is the updatedEmail */
  updatedEmail?: string
) => any

export type PluginUserConfig = {
  enable: boolean,

  sendEmail: GDmanagedLoginSendEmailFunction

  sendPasswordUpdatedMailConfirmation: (ctx: Ctx, user: ModelTypes['user']) => any

  loginConfigPerRole: Partial<Record<GD['role'], GDmanagedLoginLoginConfig>>

  /** Cookie may be set for user authentication and session. Typically a value like: '.myDomain.com' */
  cookieProductionDomain: string

  // OPTIONAL TYPES
  /** This email is sent when user update their email and when update has succeeded */
  sendEmailUpdatedMailConfirmation?: GDmanagedLoginSendEmailUpdatedMailConfirmationFunction
  /** Default 30 minutes */
  emailTokenTimeValidMinutes?: number
  /** Default: true */
  loginErrorIfEmailIsNotValidated?: boolean
  /** Add types here if you want to add a type to validation tokens (like forgotPassord) */
  validationTokenTypes?: readonly string[] | string[]
  /** Configure the time before the refresh token gets expired. Default: 15 minutes */
  refreshTokenExpirationMinutes?: number
  /** How much connexion token is allowed per roles, in other words how much simultaneous devices a user is allowed to be connected on. Default: 2 */
  maxRefreshTokenPerRole?: Record<GD['role'], number>
  /** Define which regexp should be applied when validating passwords. Default: at least 1 uppercase letter, 1 lowercase and 1 number */
  passwordRegexp?: RegExp
  /** Default 8 */
  passwordMinLength?: number
  /** Default 35 */
  passwordMaxLength?: number
  /** Secret for your JWT/ This should be passed via ENV variables and should NOT be exposed in your repository
   * @link https://jwt.io/introduction
   */
  jwtSecret: string
  /** Token expiration time (default 15 minutes)
  * @link https://jwt.io/introduction
  */
  jwtExpirationMs?: number
  /** Token expiration time for web (default 48h) Web is less secure than mobile so you can set a different value here
   * @link https://jwt.io/introduction
   */
  jwtRefreshExpirationMsWeb?: number | 'never'
  /** Token expiration time for web (default 48h) In mobile, everything should be stored in secureStore. You may want the token to never expire if you use 2FA or biometric auth
  * @link https://jwt.io/introduction
  */
  jwtRefreshExpirationMsMobile?: number | 'never'
}

export const defaultConfig = {
  enable: true,
  refreshTokenExpirationMinutes: 15,
  emailTokenTimeValidMinutes: 30,
  validationTokenTypes: [],
  // at least 1 upperCase, 1 lowerCase, 1 digit
  passwordRegexp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  passwordMinLength: 8,
  passwordMaxLength: 35,
  loginErrorIfEmailIsNotValidated: true,
} satisfies Partial<PluginUserConfig>