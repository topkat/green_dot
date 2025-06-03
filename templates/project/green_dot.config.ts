
import 'typescript-generic-types'
import { GreenDotConfig } from 'green_dot'

const env = (process.env.NODE_ENV || 'development') as Env

export const allRoles = ['user', 'admin'] as const
export type AllRoles = typeof allRoles[number]

export const allPermissions = ['examplePermission'] as const
export type AllPermissions = typeof allPermissions[number]

export const allPlatforms = ['app'] as const
export type AllPlatforms = typeof allPlatforms[number]

export default {
  env: env as Env,
  isProdEnv: env === 'production' || env === 'preprod',
  isTestEnv: env === 'test' || env === 'ci',
  defaultDatabaseName: 'mainDb',
  allRoles,
  allPermissions: [],
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

  // This allow you to access all roles and permissions within your app
  // with GD['role'] and GD['permission] as global types
  interface GD_RegisterAllRoles extends Record<AllRoles, any> { }
  interface GD_RegisterAllPermissions extends Record<AllPermissions, any> { }
  interface GD_RegisterAllPlatforms extends Record<AllPlatforms, any> { }

  // Here you can augment Ctx with your custom functions types
  interface Ctx {
    // myCustomProp: boolean
  }

  // Here you can augment global GD variable as you like
  interface GD {

  }
}