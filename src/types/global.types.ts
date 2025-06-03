import './databaseEvents.types'
import { DefaultPermissions, DefaultRoles } from './coreGeneric.types'

interface GDbase {
  testUserNames: string
  apiKeys: string
  testEnvType: any
}

interface GDeventNamesBase {
  // [eventName: string]: any[]
}

declare global {

  // Those types are helpers to make it easy to augment types like role, permissions or platform
  interface GD_RegisterAllRoles extends Record<DefaultRoles, any> { }
  interface GD_RegisterAllPermissions extends Record<DefaultPermissions, any> { }
  interface GD_RegisterAllPlatforms { }

  /** This stores all error names, particularly for `ctx.throw` autocompletion */
  interface GreenDotErrors { }

  type GreenDotErrorNames = keyof GreenDotErrors

  interface GD extends GDbase {
    role: keyof GD_RegisterAllRoles
    permission: keyof GD_RegisterAllPermissions
    platform: keyof GD_RegisterAllPlatforms
  }

  type UserRolePermissionFields = { [K in GD['role']as `is${Capitalize<K>}`]: boolean }
  type UserPermissionFields = Record<GD['permission'], boolean> & UserRolePermissionFields
  type UserPermissionsWithoutRolePerms = Omit<UserPermissionFields, keyof UserRolePermissionFields>

  interface GDeventNames extends GDeventNamesBase { }

  type NewEventType<EventName extends string, Params extends any[] = []> = { [k in EventName]: [systemCtx: Ctx, ...params: Params] }
}

export default {} // avoid typescript bug