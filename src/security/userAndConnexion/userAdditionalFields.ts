
import { _, InferTypeRead, InferTypeWrite } from 'good-cop'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'


export const userLockReasons = ['tooMuchPasswordAttempts', 'ban', 'tooManyAttempsForSecureAuthentication'] as const
export type UserLockReasonsDefault = typeof userLockReasons[number]



export function getUserAdditionalFields({ silent = false } = {}) {

  const mainConfig = getMainConfig(silent)

  return {
    /** Ability to lock a user for a time after nb of password retrial */
    lockedReason: _.enum([...(mainConfig?.userLockReasons || []), ...userLockReasons] as const),
    lockUntil: _.date(),
  }
}


// TO BE AUGMENTED BY PLUGINS
export interface UserAdditionalFieldsRead extends InferTypeRead<ReturnType<typeof getUserAdditionalFields>> { }
export interface UserAdditionalFieldsWrite extends InferTypeWrite<ReturnType<typeof getUserAdditionalFields>> { }
export type UserAdditionalFields = UserAdditionalFieldsRead
