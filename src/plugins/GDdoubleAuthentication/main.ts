import { AuthenticationMethod } from '../../ctx'
import bcrypt from 'bcrypt'
import { getId, timeout, random } from 'topkat-utils'
import { lockUserAndThrow } from '../../security/userAndConnexion/userLockService'
import { ModelTypes } from '../../cache/dbs/index.generated'
import { db } from '../../db'
import { AsMongooseBody } from '../../databases/mongo/types/mongoDbBaseTypes'
import { GDplugin } from '../GDplugin'
import { getOnLogin } from './onLogin'
import { encryptPassword } from '../../security/userAndConnexion/encryptPassword'
import { _, InferTypeRead, InferTypeWrite } from 'good-cop'


export type Name = 'GDdoubleAuthentication'

export const documentation = `
# GDdoubleAuthentication Plugin

## Features

- Multiple authentication methods:
  - Two-Factor Authentication (2FA)
  - PIN code authentication
  - Biometric authentication
- Configurable security settings:
  - Number of allowed attempts before lockout
  - Lockout duration
  - PIN code length customization
- Anti-timing attack protection
- Automatic attempt tracking and reset
- User lockout mechanism after multiple failed attempts

## Configuration

The plugin can be configured with the following options:

\`\`\`typescript
{
  enable: boolean,                    // Enable/disable the plugin
  nbAttemptsForAuth?: {              // Number of allowed attempts per auth method
    '2FA'?: number,                  // Default: 3
    biometricAuthToken?: number,     // Default: 3
    pincode?: number                 // Default: 3
  },
  resetTimeMinutesForSecureConnexion?: number,  // Lockout duration in minutes (Default: 15)
  pinCodeLength?: number             // Length of PIN code (Default: 4)
}
\`\`\`

## Usage

The plugin automatically hooks into the login process and requires one of the following headers in the request:
- \`biometricAuthToken\`: For biometric authentication
- \`pincode\`: For PIN code authentication
- \`2FA\`: For two-factor authentication

## Security Features

1. **Attempt Tracking**: Each authentication method tracks failed attempts separately
2. **Automatic Lockout**: Users are locked out after exceeding the configured number of attempts
3. **Time-based Reset**: Failed attempt counters reset after the configured lockout period
4. **Anti-Timing Attack**: Random delays are added to prevent timing-based attacks
5. **Secure Storage**: PIN codes are encrypted using bcrypt

## User Fields

The plugin adds the following fields to the user model:
- PIN Code related:
  - \`pinCode\`: Encrypted PIN code
  - \`pinCodeRetrialNb\`: Number of failed PIN attempts
  - \`lastPincodeCompareTime\`: Timestamp of last PIN verification
- 2FA related:
  - \`_2FAcode\`: Current 2FA code
  - \`_2FAretrialNb\`: Number of failed 2FA attempts
  - \`last2FACompareTime\`: Timestamp of last 2FA verification
- Biometric related:
  - \`biometricAuthToken\`: Biometric authentication token
  - \`biometricAuthRetrialNb\`: Number of failed biometric attempts
  - \`lastBiometricCompareTime\`: Timestamp of last biometric verification

## Error Handling

The plugin throws the following errors:
- \`wrongToken\`: When an invalid authentication token is provided
- \`tooManyAttempsForSecureAuthentication\`: When the maximum number of attempts is exceeded
`


const userFieldNbAttemps = {
  pincode: 'pinCodeRetrialNb',
  '2FA': '_2FAretrialNb',
  biometricAuthToken: 'biometricAuthRetrialNb'
} satisfies Record<AuthenticationMethod, keyof ModelTypes['user']>

const userFieldLastCompareTime = {
  pincode: 'lastPincodeCompareTime',
  '2FA': 'last2FACompareTime',
  biometricAuthToken: 'lastBiometricCompareTime'
} satisfies Record<AuthenticationMethod, keyof ModelTypes['user']>




export type PluginUserConfig = {
  enable: boolean,
  /** Secure connexion is Double authentication via sms, fingerprint or pinCode. This will configure nb attemps before locking for a configurable time period. Default: 3 */
  nbAttemptsForAuth?: Partial<Record<AuthenticationMethod, number>>
  /** Secure connexion is Double authentication via sms, fingerprint or pinCode. This will configure the time before unlocking after "nbAttemptsForAuth" fails. Default: 15 */
  resetTimeMinutesForSecureConnexion?: number
  /** Length of pincode. Default 4 */
  pinCodeLength?: number
}


export const defaultConfig = {
  enable: true,
  nbAttemptsForAuth: { '2FA': 3, biometricAuthToken: 3, pincode: 3 },
  pinCodeLength: 4,
  resetTimeMinutesForSecureConnexion: 15,
} satisfies PluginUserConfig


/** This handles 2FA, pinCode authentication or biometric authentication.
Request headers must contain at least one of those fields to work: `biometricAuthToken`, `pincode`, `2FA`.
*/
export class GDdoubleAuthentication extends GDplugin<Name> {
  name = 'GDdoubleAuthentication' as const
  version = '1.0.0'

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

    const timeBetweenTwoAttempts = this.config.resetTimeMinutesForSecureConnexion * 60 * 1000

    await timeout(random(1, 80)) // anti timer attack

    const user = typeof userOrId === 'string' ? await db.user.getById(ctx, userOrId, { triggerErrorIfNotSet: true }) : userOrId

    const nbAttemptFieldNameInUser = userFieldNbAttemps[type]
    const lastCompareTimeFieldNameInUser = userFieldLastCompareTime[type]

    const lastCompareTime = (new Date(user[lastCompareTimeFieldNameInUser])).getTime()

    const allowedAttemptsNb = this.config.nbAttemptsForAuth?.[type] || 3

    // for a long period of time since last check, we reset the nbAttempts
    const userNbAttempts = lastCompareTime + timeBetweenTwoAttempts < Date.now() ? 0 : user[nbAttemptFieldNameInUser]

    if (userNbAttempts >= allowedAttemptsNb) {
      await lockUserAndThrow(ctx, getId(user), 'tooManyAttempsForSecureAuthentication', {
        errExtraInfos: { authType: type, allowedAttemptsNb, resetTime: Date.now() + timeBetweenTwoAttempts },
      })
    }

    let success = false
    const fieldsToUpdate: Partial<AsMongooseBody<ModelTypes['userWrite']>> = {}

    if (type === 'pincode' && user.pinCode && await bcrypt.compare(token, user.pinCode)) {
      success = true
    } else if (type === '2FA' && token === user._2FAcode) {
      success = true
      fieldsToUpdate._2FAcode = null
    } else if (type === 'biometricAuthToken' && token === user.biometricAuthToken) {
      success = true
    }

    // reset nb attempts or add one if wrong token
    Object.assign(fieldsToUpdate, success ? { [nbAttemptFieldNameInUser]: 0 } : { $inc: { [nbAttemptFieldNameInUser]: 1 } })

    await db.user.update(ctx.GM, getId(user), {
      ...fieldsToUpdate,
      [lastCompareTimeFieldNameInUser]: new Date(),
    })

    if (!success) throw ctx.error.wrongToken({ type })

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
declare module '../../security/userAndConnexion/userAdditionalFields' {
  interface UserAdditionalFieldsRead extends InferTypeRead<ReturnType<GDdoubleAuthentication['addUserAdditionalFields']>> { }
  interface UserAdditionalFieldsWrite extends InferTypeWrite<ReturnType<GDdoubleAuthentication['addUserAdditionalFields']>> { }
}