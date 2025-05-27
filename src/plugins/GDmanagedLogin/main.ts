import { GDplugin } from '../GDplugin'
import { getOnLogin } from './onLogin'
import { getNewTokenService } from './apiServices/getNewTokenService'
import { InferTypeRead, InferTypeWrite, _ } from 'good-cop'
import { encryptPassword } from '../../security/userAndConnexion/encryptPassword'
import { getCheckTokenIsValidService } from './apiServices/getCheckTokenIsValidService'
import { ModelTypes } from '../../cache/dbs/index.generated'
import { EmailTypes, emailTypes } from './constants'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { getValidateTokenAndLoginService } from './apiServices/getValidateTokenAndLoginService'
import { getLogoutService } from './apiServices/getLogoutService'
import { getUpdateNewPasswordWithOldPassword } from './apiServices/getUpdateNewPasswordWithOldPassword'
import { getCredentialManagementServices } from './apiServices/getCredentialManagementServices'
import { RegisterErrorType } from '../../error'
import { setConnexionTokens } from './userAuthenticationTokenService'
import { getLoginServices } from './apiServices/getLoginServices'


export type Name = 'GDmanagedLogin'

//  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗
//  ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦
//  ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝

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

export type PluginUserConfig = {
  enable: boolean,

  sendEmail(
    ctx: Ctx,
    emailType: EmailTypes,
    encodedToken: string,
    user: ModelTypes['user'],
    /** Thoses can be optionnaly passed in frontend in the SDK and will be forwarded to the function  */
    additionalParams: Record<string, any>,
    /** In case emailType is changeEmail, this is the updatedEmail */
    updatedEmail?: string
  ): any

  sendPasswordUpdatedMailConfirmation: (ctx: Ctx, user: ModelTypes['user']) => any

  /** This is the role that will be used upon subscription */
  // defaultRoleForConnexion: GD['role']

  loginConfigPerRole: Partial<Record<GD['role'], GDmanagedLoginLoginConfig>>

  // OPTIONAL TYPES

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


//  ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ╔══╗ ╔═╗    ╦    ╔══╗ ╔══╗ ═╦═ ╦╗ ╔
//  ║╚╝║ ╠══╣ ║╚╗║ ╠══╣ ║ ═╦ ╠═   ║  ║   ║    ║  ║ ║ ═╦  ║  ║╚╗║
//  ╩  ╩ ╩  ╩ ╩ ╚╩ ╩  ╩ ╚══╝ ╚══╝ ╚══╝   ╚══╝ ╚══╝ ╚══╝ ═╩═ ╩ ╚╩

/** Managed Login will handle login end to end with SDK integration, password management, cookie and secure connexion via JWT with latest OWASP standards. */
export class GDmanagedLogin extends GDplugin<Name> {

  name = 'GDmanagedLogin' as const
  version = '1.0.0'

  config: PluginUserConfig

  constructor(config: PluginUserConfig) {
    super()
    // DEFAULT maxRefreshTokenPerRole
    const mainConfig = getMainConfig()
    if (!config.maxRefreshTokenPerRole) {
      for (const role of mainConfig.allRoles) {
        config.maxRefreshTokenPerRole ??= { public: 2 }
        config.maxRefreshTokenPerRole[role] = 2
      }
    }
    this.config = { ...defaultConfig, ...config }

    // SERVICES
    this.serviceToRegister = {
      ...getNewTokenService(),
      ...getCheckTokenIsValidService(this.config),
      ...getValidateTokenAndLoginService(this.config),
      ...getLogoutService(),
      ...getUpdateNewPasswordWithOldPassword(this.config),
      ...getCredentialManagementServices(this.config),
      ...getLoginServices(this.config),
    }
    // HANDLERS
    this.handlers = [{
      priority: 10,
      event: 'onLogin',
      callback: getOnLogin()
    }]
  }

  //  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔═══
  //  ╠═   ╠═╦╝ ╠═╦╝ ║  ║ ╠═╦╝ ╚══╗
  //  ╚══╝ ╩ ╚  ╩ ╚  ╚══╝ ╩ ╚  ═══╝
  errors = {
    emailNotSet: { code: 400 },
    newEmailSameAsOld: { code: 409 },
    newPasswordSameAsOld: { code: 409 },
    wrongNewEmail: { code: 403 },
  }

  //  ╦  ╦ ╔═══ ╔══╗ ╔══╗   ╔══╗ ╔═╗  ╔═╗  ═╦═ ══╦══ ═╦═ ╔══╗ ╦╗ ╔ ╔══╗ ╦      ╔══╗ ═╦═ ╔══╗ ╦    ╔═╗  ╔═══
  //  ║  ║ ╚══╗ ╠═   ╠═╦╝   ╠══╣ ║  ║ ║  ║  ║    ║    ║  ║  ║ ║╚╗║ ╠══╣ ║      ╠═    ║  ╠═   ║    ║  ║ ╚══╗
  //  ╚══╝ ═══╝ ╚══╝ ╩ ╚    ╩  ╩ ╚══╝ ╚══╝ ═╩═   ╩   ═╩═ ╚══╝ ╩ ╚╩ ╩  ╩ ╚══╝   ╩    ═╩═ ╚══╝ ╚══╝ ╚══╝ ═══╝
  addUserAdditionalFields() {

    const { passwordRegexp, passwordMinLength, passwordMaxLength, validationTokenTypes } = this.config

    return {

      email: _.email().unique(),
      /** this is when a request for updating the email is made */
      newEmail: _.email(),

      /** default encrypted */
      password: _.password({
        minLength: passwordMinLength,
        maxLength: passwordMaxLength, // FIX bug in seed when creating bcrypt password
        regexp: passwordRegexp,
        encrypt: async password => await encryptPassword(password),
      }),
      /** Used to validate phone or email */
      validationTokens: _.array({
        validUntil: _.date(),
        creationDate: _.date(),
        value: _.string(),
        type: _.enum([...(validationTokenTypes || []), ...emailTypes]),
      }),
      /** Those are used to request an access token. Access token changes every N minutes, while refresh tokens last for a session */
      refreshTokens: [_.string()],
      accessTokens: [_.string()],

      lastPasswordCompareTime: _.date().default(new Date()),
      passwordRetrialNb: _.number().default(0),
    }
  }
}


//  ══╦══ ╦   ╦ ╔══╗ ╔══╗   ╔══╗ ═╗╔═ ══╦══ ╔══╗ ╦╗ ╔ ╔═══ ═╦═ ╔══╗ ╦╗ ╔ ╔═══
//    ║   ╚═╦═╝ ╠══╝ ╠═     ╠═    ╠╣    ║   ╠═   ║╚╗║ ╚══╗  ║  ║  ║ ║╚╗║ ╚══╗
//    ╩     ╩   ╩    ╚══╝   ╚══╝ ═╝╚═   ╩   ╚══╝ ╩ ╚╩ ═══╝ ═╩═ ╚══╝ ╩ ╚╩ ═══╝

// DECLARE ADDITIONAL USER FIELDS TYPE
declare module '../../security/userAndConnexion/userAdditionalFields' {
  interface UserAdditionalFieldsRead extends InferTypeRead<ReturnType<GDmanagedLogin['addUserAdditionalFields']>> { }
  interface UserAdditionalFieldsWrite extends InferTypeWrite<ReturnType<GDmanagedLogin['addUserAdditionalFields']>> { }
}

// DECLARE ERROR TYPE
declare global {
  interface GreenDotErrors extends RegisterErrorType<GDmanagedLogin['errors']> { }
}

