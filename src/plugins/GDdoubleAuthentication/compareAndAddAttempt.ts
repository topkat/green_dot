import { AuthenticationMethod } from '../../ctx.js'
import bcrypt from 'bcrypt'
import { getId, timeout, random } from 'topkat-utils'
import { lockUserAndThrow } from '../../security/userAndConnexion/userLockService.js'
import { ModelTypes } from '../../cache/dbs/index.generated.js'
import { db } from '../../db.js'
import { AsMongooseBody } from '../../databases/mongo/types/mongoDbBaseTypes.js'
import { PluginUserConfig } from './config.js'





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



export async function compareAndAddAttempt(pluginConfig: PluginUserConfig, ctx: Ctx, type: AuthenticationMethod, token: string, userOrId: ModelTypes['user'] | string): Promise<void> {

  const timeBetweenTwoAttempts = pluginConfig.resetTimeMinutesForSecureConnexion * 60 * 1000

  await timeout(random(1, 80)) // anti timer attack

  const user = typeof userOrId === 'string' ? await db.user.getById(ctx, userOrId, { triggerErrorIfNotSet: true }) : userOrId

  const nbAttemptFieldNameInUser = userFieldNbAttemps[type]
  const lastCompareTimeFieldNameInUser = userFieldLastCompareTime[type]

  const lastCompareTime = (new Date(user[lastCompareTimeFieldNameInUser])).getTime()

  const allowedAttemptsNb = pluginConfig.nbAttemptsForAuth?.[type] || 3

  // for a long period of time since last check, we reset the nbAttempts
  const userNbAttempts = lastCompareTime + timeBetweenTwoAttempts < Date.now() ? 0 : user[nbAttemptFieldNameInUser]

  if (userNbAttempts >= allowedAttemptsNb) {
    await lockUserAndThrow(ctx, getId(user), 'tooManyAttempsForSecureAuthentication', {
      errExtraInfos: { authType: type, allowedAttemptsNb, resetTime: Date.now() + timeBetweenTwoAttempts },
    })
  }

  let success = false
  const fieldsToUpdate: Partial<AsMongooseBody<ModelTypes['userWrite']>> = {}

  if (type === 'pincode' && user.pinCode && (await bcrypt.compare(token, user.pinCode))) {
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