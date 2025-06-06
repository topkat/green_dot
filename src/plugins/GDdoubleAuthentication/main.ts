import { AuthenticationMethod } from '../../ctx.js'
import { ModelTypes } from '../../cache/dbs/index.generated.js'
import { GDplugin } from '../GDplugin.js'
import { getOnLogin } from './onLogin.js'
import { encryptPassword } from '../../security/userAndConnexion/encryptPassword.js'
import { _, InferTypeRead, InferTypeWrite } from 'good-cop'
import { documentation, docOneLine } from './doc.js'
import { newPlugin } from '../newPlugin.js'
import { defaultConfig, PluginUserConfig } from './config.js'
import { compareAndAddAttempt } from './compareAndAddAttempt.js'

export type Name = 'GDdoubleAuthentication'

/** This handles 2FA, pinCode authentication or biometric authentication.
Request headers must contain at least one of those fields to work: `biometricAuthToken`, `pincode`, `2FA`.
*/
export class GDdoubleAuthentication extends GDplugin<Name> {

  name = 'GDdoubleAuthentication' as const

  config: PluginUserConfig

  constructor(config: PluginUserConfig) {
    super()
    this.config = { ...defaultConfig, ...config }
    this.handlers = [{
      priority: 20,
      event: 'onLogin',
      callback: getOnLogin(this)
    }]
  }

  async compareAndAddAttempt(ctx: Ctx, type: AuthenticationMethod, token: string, userOrId: ModelTypes['user'] | string): Promise<void> {
    return await compareAndAddAttempt(this.config, ctx, type, token, userOrId)
  }

  addUserAdditionalFields() {

    const { pinCodeLength } = this.config

    return {
      // PIN CODE
      pinCode: _.password({
        minLength: pinCodeLength,
        maxLength: pinCodeLength, // FIX bug in seed when creating bcrypt password
        regexp: /^\d+$/,
        encrypt: async password => await encryptPassword(password),
      }),
      pinCodeRetrialNb: _.number().default(0),
      lastPincodeCompareTime: _.date().default(new Date()),
      biometricAuthToken: _.string(),
      biometricAuthRetrialNb: _.number().default(0),
      lastBiometricCompareTime: _.date().default(new Date()),
      _2FAcode: _.string().length(6),
      _2FAretrialNb: _.number().default(0),
      last2FACompareTime: _.date().default(new Date()),
    }
  }
}

//  ══╦══ ╦   ╦ ╔══╗ ╔══╗   ╔══╗ ═╗╔═ ══╦══ ╔══╗ ╦╗ ╔ ╔═══ ═╦═ ╔══╗ ╦╗ ╔ ╔═══
//    ║   ╚═╦═╝ ╠══╝ ╠═     ╠═    ╠╣    ║   ╠═   ║╚╗║ ╚══╗  ║  ║  ║ ║╚╗║ ╚══╗
//    ╩     ╩   ╩    ╚══╝   ╚══╝ ═╝╚═   ╩   ╚══╝ ╩ ╚╩ ═══╝ ═╩═ ╚══╝ ╩ ╚╩ ═══╝

// DECLARE ADDITIONAL USER FIELDS TYPE
declare module '../../security/userAndConnexion/userAdditionalFields.js' {
  interface UserAdditionalFieldsRead extends InferTypeRead<ReturnType<GDdoubleAuthentication['addUserAdditionalFields']>> { }
  interface UserAdditionalFieldsWrite extends InferTypeWrite<ReturnType<GDdoubleAuthentication['addUserAdditionalFields']>> { }
}

//  ═╦═ ╦╗ ╔ ═╦═ ══╦══   ╔══╗ ╦    ╦  ╦ ╔══╗ ═╦═ ╦╗ ╔
//   ║  ║╚╗║  ║    ║     ╠══╝ ║    ║  ║ ║ ═╦  ║  ║╚╗║
//  ═╩═ ╩ ╚╩ ═╩═   ╩     ╩    ╚══╝ ╚══╝ ╚══╝ ═╩═ ╩ ╚╩
export default newPlugin<Name, PluginUserConfig, typeof GDdoubleAuthentication>({
  name: 'GDdoubleAuthentication',
  version: '1.0.0',
  defaultConfig,
  documentation,
  docOneLine,
  plugin: GDdoubleAuthentication,
})