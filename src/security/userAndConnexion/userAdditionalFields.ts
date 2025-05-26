
import { _ } from 'good-cop'
import { encryptPassword } from '../../plugins/managedLogin/userPasswordService' // TODO this don't belong here plugin code shouldn't be imported in main app
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { getPluginConfig } from '../../plugins/pluginSystem'

// at least 1 upperCase, 1 lowerCase, 1 digit
const emailRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/

export const userLockReasons = ['tooMuchPasswordAttempts', 'ban', 'tooManyAttempsForSecureAuthentication'] as const
export type UserLockReasonsDefault = typeof userLockReasons[number]

const emailTypes = ['forgotPassword', 'emailValidation', 'changeEmail'] as const


export function getUserAdditionalFields({ silent = false } = {}) {

  const mainConfig = getMainConfig(silent)
  const { validationTokenTypes } = getPluginConfig('GDmanagedLogin')
  const { pinCodeLength } = getPluginConfig('GDdoubleAuthentication')

  return {
    phonePrefix: _.regexp(/^\+\d+$/),
    phoneWithPrefix: _.string().minLength(7).maxLength(15).unique().optional(),

    email: _.email().unique(),
    /** this is when a request for updating the email is made */
    newEmail: _.email(),

    /** default encrypted */
    password: _.password({
      minLength: 8,
      maxLength: 99, // FIX bug in seed when creating bcrypt password
      regexp: mainConfig?.emailRegexp || emailRegexp,
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
    /** Ability to lock a user for a time after nb of password retrial */
    lockedReason: _.enum([...(mainConfig?.userLockReasons || []), ...userLockReasons] as const),
    lockUntil: _.date(),
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

const typ = _.object<
  ReturnType<typeof getUserAdditionalFields>
>({} as any)


export type UserAdditionalFieldsRead = typeof typ.tsTypeRead
export type UserAdditionalFieldsWrite = typeof typ.tsTypeWrite