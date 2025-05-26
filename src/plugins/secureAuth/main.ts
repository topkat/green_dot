import { AuthenticationMethod } from '../../ctx'
import bcrypt from 'bcrypt'
import { getId, timeout, random } from 'topkat-utils'
import { lockUserAndThrow } from '../../security/userAndConnexion/userLockService'
import { ModelTypes } from '../../cache/dbs/index.generated'
import { db } from '../../db'
import { AsMongooseBody } from '../../databases/mongo/types/mongoDbBaseTypes'
import { GDplugin } from '../GDplugin'



export type Name = 'GDdoubleAuthentication'

export const documentation = ``


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


export const defaultConfig: PluginUserConfig = {
  enable: true,
  nbAttemptsForAuth: { '2FA': 3, biometricAuthToken: 3, pincode: 3 },
  pinCodeLength: 4,
  resetTimeMinutesForSecureConnexion: 15,
}



export class GDdoubleAuthentication extends GDplugin<Name> {
  name = 'GDdoubleAuthentication' as const
  version = '1.0.0'

  config: PluginUserConfig

  constructor(config: PluginUserConfig) {
    super()
    this.config = { ...defaultConfig, ...config }
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
}