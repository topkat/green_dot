import './databaseEvents.types'

interface GDbase {
  platform: 'notImplemented'
  role: 'notImplemented' // needs to be union since string will mess everything
  permissions: 'notImplemented'
}

interface GDeventNamesBase {
  // [eventName: string]: any[]
}

declare global {
  /** This stores all error names, particularly for `ctx.throw` autocompletion */
  interface GreenDotErrors { }

  type GreenDotErrorNames = keyof GreenDotErrors

  interface GD extends GDbase { }

  type UserRolePermissionFields = { [K in GD['role']as `is${Capitalize<K>}`]: boolean }
  type UserPermissionFields = Record<GD['permissions'], boolean> & UserRolePermissionFields
  type UserPermissionsWithoutRolePerms = Omit<UserPermissionFields, keyof UserRolePermissionFields>

  interface GDeventNames extends GDeventNamesBase { }

  type NewEventType<EventName extends string, Params extends any[] = []> = { [k in EventName]: [systemCtx: Ctx, ...params: Params] }


  interface TestEnv { }

}

export default {} // avoid typescript bug