import { AuthenticationMethod } from '../../ctx.js'



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