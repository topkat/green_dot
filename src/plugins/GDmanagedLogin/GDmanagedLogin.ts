import { GDplugin } from '../GDplugin.js'
import { getOnLoginHandler } from './onLogin.js'
import { getNewTokenService } from './apiServices/getNewTokenService.js'
import { InferTypeRead, InferTypeWrite, _ } from 'good-cop'
import { encryptPassword } from '../../security/userAndConnexion/encryptPassword.js'
import { getCheckTokenIsValidService } from './apiServices/getCheckTokenIsValidService.js'
import { ModelTypes } from '../../cache/dbs/index.generated.js'
import { gdManagedLoginEmailTypes } from './constants.js'
import { getMainConfig } from '../../helpers/getGreenDotConfigs.js'
import { getValidateTokenAndLoginService } from './apiServices/getValidateTokenAndLoginService.js'
import { getLogoutService } from './apiServices/getLogoutService.js'
import { getUpdateNewPasswordWithOldPassword } from './apiServices/getUpdateNewPasswordWithOldPassword.js'
import { getCredentialManagementServices } from './apiServices/getCredentialManagementServices.js'
import { RegisterErrorType } from '../../error.js'
import { setConnexionTokens } from './userAuthenticationTokenService.js'
import { getLoginServices } from './apiServices/getLoginServices.js'
import { getUpdatePasswordService } from './apiServices/getUpdatePasswordService.js'
import { getUpdateEmailService } from './apiServices/getUpdateEmailService.js'
import { userLoginReturnValidator, userLogin } from './userLogin.js'
import { comparePasswordAddAttemptAndLockIfNecessary } from './userPasswordService.js'
import { getRegisterUserDeviceService } from './apiServices/getRegisterUserDeviceService.js'
import { credentialManagementMailing } from './credentialManagementMailing.js'
import { db } from '../../db.js'
import { getId } from 'topkat-utils'
import { defaultConfig, PluginUserConfig } from './config.js'
import { getSendValidationEmailService } from './apiServices/getSendValidationEmailService.js'

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
        config.maxRefreshTokenPerRole ??= { public: 2 } as any
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
      ...getSendValidationEmailService(this.config),
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
        type: _.enum([...(validationTokenTypes || []), ...gdManagedLoginEmailTypes]),
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
declare module '../../security/userAndConnexion/userAdditionalFields.js' {
  interface UserAdditionalFieldsRead extends InferTypeRead<ReturnType<GDmanagedLogin['addUserAdditionalFields']>> { }
  interface UserAdditionalFieldsWrite extends InferTypeWrite<ReturnType<GDmanagedLogin['addUserAdditionalFields']>> { }
}

// DECLARE ERROR TYPE
declare global {
  interface GreenDotErrors extends RegisterErrorType<GDmanagedLogin['errors']> { }
}

