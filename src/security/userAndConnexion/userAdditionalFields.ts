
import { Definition, InferTypeRead, InferTypeWrite, NextAutocompletionChoices } from '../../lib/good-cop/src/index.js'
import { getMainConfig } from '../../helpers/getGreenDotConfigs.js'
import { _ } from '../../validator.js'
import { _ as fixRecursiveType } from '../../lib/good-cop/src/index.js'
import { GD_deviceModel } from './GD_device.model.js'
import { ModelsWithDbNamesAndReadWrite } from '../../cache/dbs/index.generated.js'


export const userLockReasons = ['tooMuchPasswordAttempts', 'ban', 'tooManyAttempsForSecureAuthentication'] as const
export type UserLockReasonsDefault = typeof userLockReasons[number]

export function getUserAdditionalFields({ silent = false } = {}) {


  const mainConfig = getMainConfig(silent)

  // FIX a type recursively reference itself problem
  type RecursiveTypeFixType = { Read: typeof GD_deviceModel.tsTypeRead, Write: typeof GD_deviceModel.tsTypeWrite }
  const def = _.ref('GD_device') as NextAutocompletionChoices<
    Definition<ModelsWithDbNamesAndReadWrite, RecursiveTypeFixType | string, string>
  >


  return {
    /** Ability to lock a user for a time after nb of password retrial */
    lockedReason: fixRecursiveType.enum([...(mainConfig?.userLockReasons || []), ...userLockReasons] as const),
    lockUntil: fixRecursiveType.date(),
    devices: [def],
  }
}


// TO BE AUGMENTED BY PLUGINS
export interface UserAdditionalFieldsRead extends InferTypeRead<ReturnType<typeof getUserAdditionalFields>> { }
export interface UserAdditionalFieldsWrite extends InferTypeWrite<ReturnType<typeof getUserAdditionalFields>> { }
export type UserAdditionalFields = UserAdditionalFieldsRead