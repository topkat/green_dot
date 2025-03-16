

declare global {
  /** This stores all error names, particularly for `ctx.throw` autocompletion */
  interface GreenDotErrors { }

  type GreenDotErrorNames = keyof GreenDotErrors

  interface GDbase {
    platform: 'notImplemented'
    role: 'notImplemented' // needs to be union since string will mess everything
    permissions: 'notImplemented'
  }

  interface GD extends GDbase { }

  type UserRolePermissionFields = { [K in GD['role']as `is${Capitalize<K>}`]: boolean }
  type UserPermissionFields = Record<GD['permissions'], boolean> & UserRolePermissionFields
  type UserPermissionsWithoutRolePerms = Omit<UserPermissionFields, keyof UserRolePermissionFields>
}

export default {} // avoid typescript bug