
import 'typescript-generic-types'
import { GreenDotConfig } from 'green_dot'
import { AllPermissions, allPermissions, allRoles, AllRoles, sdkNameForRole, Platforms, defaultPermRestrictionForAll, defaultPermRestrictionForRole } from './shared/constants/rolesAndPermission.constants'

const env = (process.env.NODE_ENV || 'development') as Env

export default {
  env: env as Env,
  isProdEnv: env === 'production' || env === 'preprod',
  isTestEnv: env === 'test' || env === 'ci',
  defaultDatabaseName: 'bangk',
  allPermissions,
  allRoles,
  defaultPermRestrictionForAll,
  defaultPermRestrictionForRole,
  // SECURITY FEATURES
  enableRateLimiter: true,
  enableUserBan: true,
  enableUserWarnings: true,
  generateSdkConfig: {
    enable: true,
    sdkNameForRole,
    notifyOnTelegramPrompt: { botId: 'bot7334406089:AAGCEBGafKfh6LdBikzcqV9hbMR-MBMdktQ', chatId: -4525765992 },
    npmPublishConfig: { enable: true, access: 'public', packageNamePrefix: '@bangk', npmAccessTokenForPublish: 'np' + 'm_teBRiPfh3dYXHFo' + 'hP4GW0XuWmlyjLf3TcBra' }
  }
} satisfies GreenDotConfig


//----------------------------------------------------------
//
//            GLOBAL TYPES
//
// Those global types are exposed so you can override them
// with your custom functions or props
//----------------------------------------------------------

declare global {
  // Here you can augment Ctx with your custom functions types
  interface Ctx {
    // myCustomProp: boolean
  }

  // You can access roles and permissions types across your
  // whole repo by using `GD['role']`, `GD['permissions']`...
  // green_dot also offers other helpers global types like
  // UserPermissionFields and UserRolePermissionFields
  interface GD {
    platform: Platforms
    role: AllRoles | 'public'
    permissions: AllPermissions
  }
}