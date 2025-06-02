import { GDplugin } from '../GDplugin'
import { getOnLoginHandler } from './onLogin'
import { getNewTokenService } from './apiServices/getNewTokenService'
import { InferTypeRead, InferTypeWrite, _ } from 'good-cop'
import { encryptPassword } from '../../security/userAndConnexion/encryptPassword'
import { getCheckTokenIsValidService } from './apiServices/getCheckTokenIsValidService'
import { ModelTypes } from '../../cache/dbs/index.generated'
import { emailTypes } from './constants'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { getValidateTokenAndLoginService } from './apiServices/getValidateTokenAndLoginService'
import { getLogoutService } from './apiServices/getLogoutService'
import { getUpdateNewPasswordWithOldPassword } from './apiServices/getUpdateNewPasswordWithOldPassword'
import { getCredentialManagementServices } from './apiServices/getCredentialManagementServices'
import { RegisterErrorType } from '../../error'
import { setConnexionTokens } from './userAuthenticationTokenService'
import { getLoginServices } from './apiServices/getLoginServices'
import { getUpdatePasswordService } from './apiServices/getUpdatePasswordService'
import { getUpdateEmailService } from './apiServices/getUpdateEmailService'
import { userLoginReturnValidator, userLogin } from './userLogin'
import { comparePasswordAddAttemptAndLockIfNecessary } from './userPasswordService'
import { getRegisterUserDeviceService } from './apiServices/getRegisterUserDeviceService'
import { credentialManagementMailing } from './credentialManagementMailing'
import { db } from '../../db'
import { getId } from 'topkat-utils'
import { defaultConfig, PluginUserConfig } from './config'

export type Name = 'GDmanagedLogin'

//  ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ╔══╗ ╔═╗    ╦    ╔══╗ ╔══╗ ═╦═ ╦╗ ╔
//  ║╚╝║ ╠══╣ ║╚╗║ ╠══╣ ║ ═╦ ╠═   ║  ║   ║    ║  ║ ║ ═╦  ║  ║╚╗║
//  ╩  ╩ ╩  ╩ ╩ ╚╩ ╩  ╩ ╚══╝ ╚══╝ ╚══╝   ╚══╝ ╚══╝ ╚══╝ ═╩═ ╩ ╚╩

/** Managed Login will handle login end to end with SDK integration, password management, cookie and secure connexion via JWT with latest OWASP standards. */
export class GDmanagedLogin extends GDplugin<Name> {

  name = 'GDmanagedLogin' as const

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
      ...getNewTokenService(this.config),
      ...getCheckTokenIsValidService(this.config),
      ...getValidateTokenAndLoginService(this.config),
      ...getLogoutService(),
      ...getUpdateNewPasswordWithOldPassword(this.config),
      ...getCredentialManagementServices(this.config),
      ...getLoginServices(this.config),
      ...getUpdatePasswordService(this.config),
      ...getUpdateEmailService(this.config),
      ...getRegisterUserDeviceService(),
    }
    // HANDLERS
    this.handlers = [{
      priority: 10,
      event: 'onLogin',
      callback: getOnLoginHandler(this.config)
    }]
  }

  userLoginReturnValidator = userLoginReturnValidator
  userLogin = userLogin
  comparePasswordAddAttemptAndLockIfNecessary = comparePasswordAddAttemptAndLockIfNecessary
  setConnexionTokens = setConnexionTokens
  async sendValidationEmail(ctx: Ctx, userOrId: ModelTypes['user'] | string, additionalParams?: Record<string, any>) {
    const user = typeof userOrId === 'string' ? await db.user.getById(ctx, userOrId, { triggerErrorIfNotSet: true }) : userOrId
    await credentialManagementMailing(ctx, user, getId(user), 'emailValidation', additionalParams, this.config)
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

