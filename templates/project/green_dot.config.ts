
import 'typescript-generic-types'
import { GreenDotConfig, DefaultPermissions, DefaultRoles } from 'green_dot'

const env = (process.env.NODE_ENV || 'development') as Env

export const allRoles = ['user', 'admin'] as const
export type AllRoles = typeof allRoles[number]

export default {
  env: env as Env,
  isProdEnv: env === 'production' || env === 'preprod',
  isTestEnv: env === 'test' || env === 'ci',
  defaultDatabaseName: 'mainDb',
  allRoles,
  allPermissions: [],
  // SECURITY FEATURES
  enableRateLimiter: true,
  enableUserBan: true,
  enableUserWarnings: true,
  generateSdkConfig: {
    enable: true,
    sdkNameForRole: { user: 'app' },
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
    platform: 'app'
    role: DefaultRoles | AllRoles
    permissions: DefaultPermissions
  }
}