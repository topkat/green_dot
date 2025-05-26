import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { GDplugin } from '../pluginSystem'


export type Name = 'GDmanagedLogin'


export type PluginUserConfig = {
  enable: boolean,
  /** Add types here if you want to add a type to validation tokens (like forgotPassord) */
  validationTokenTypes?: readonly string[] | string[]
  /** Configure the time before the refresh token gets expired. Default: 15 minutes */
  refreshTokenExpirationMinutes?: number
  /** Default 11 */
  saltRoundsForPasswordEncryption?: number
  /** How much connexion token is allowed per roles, in other words how much simultaneous devices a user is allowed to be connected on. Default: 2 */
  maxRefreshTokenPerRole?: Record<GD['role'], number>
}

export const defaultConfig: PluginUserConfig = {
  enable: true,
  refreshTokenExpirationMinutes: 15,
  saltRoundsForPasswordEncryption: 11,
}


export class GDmanagedLogin extends GDplugin<Name> {
  name = 'GDmanagedLogin' as const
  version = '1.0.0'

  config: PluginUserConfig

  constructor(config: PluginUserConfig) {
    super()
    if (!config.maxRefreshTokenPerRole) {
      const mainConfig = getMainConfig()
      for (const role of mainConfig.allRoles) {
        config.maxRefreshTokenPerRole ??= { public: 2 }
        config.maxRefreshTokenPerRole[role] = 2
      }
    }
    this.config = { ...defaultConfig, ...config }
  }
}