import { GDplugin } from '../GDplugin'
import { getOnLogin } from './onLogin'


export type Name = 'GDapiKeyAuthentication'

export const documentation = ``

export type GDapiKey = {
  [apiKey in (GD['role'] | (string & {}))]?: {
    _id?: string
    token: string
    role?: GD['role'] // GD['role'] extends 'notImplemented' ? string : GD['role']
    permissions?: Partial<Record<GD['permissions'], any>>
    // TODO
    /** Add IPs to whitelist, all other IPs will be non-authorized to authenticate with apiKey */
    ipWhitelist?: MaybeArray<string>
  } // /!\ Used in rest-test package
}

export type PluginUserConfig = {
  enable: boolean,
  apiKeys?: GDapiKey
}


export const defaultConfig = {
  enable: true,
} satisfies PluginUserConfig


/** This handles 2FA, pinCode authentication or biometric authentication.
Request headers must contain at least one of those fields to work: `biometricAuthToken`, `pincode`, `2FA`.
*/
export class GDapiKeyAuthentication extends GDplugin<Name> {
  name = 'GDapiKeyAuthentication' as const
  version = '1.0.0'

  config: PluginUserConfig

  constructor(config: PluginUserConfig) {
    super()
    this.config = { ...defaultConfig, ...config }
    this.handlers = [{
      priority: 30,
      event: 'onLogin',
      callback: getOnLogin(this)
    }]
  }
}