

import { objEntries } from 'topkat-utils'
import { GreenDotConfig } from 'green_dot'

//----------------------------------------
// ROLES
//----------------------------------------
export const allRoles = [
  // /!\ Roles are just linked to an interface
  'appUser', // mobile app
  'icoInvestor', // ico dashboard
  'bangkAdmin' // internal dashboard
] as const
export type AllRoles = typeof allRoles[number]

//----------------------------------------
// SDK NAMES FOR ROLE
//----------------------------------------
export const sdkNameForRole = {
  appUser: 'mobileApp',
  bangkAdmin: 'admin',
  icoInvestor: 'icoDashboard'
} as const satisfies Record<AllRoles, string>

export type SdkNameForRole = typeof sdkNameForRole
export type Platforms = SdkNameForRole[keyof SdkNameForRole]
export type PermissionPerPlatform = { [K in keyof SdkNameForRole as `${SdkNameForRole[K]}`]: K }
export const permissionPerPlatform = (objEntries(sdkNameForRole).reduce((o, [k, v]) => ({ ...o, [v]: k }), {})) as PermissionPerPlatform

//----------------------------------------
// PERMISSIONS
//----------------------------------------

export const allPermissions = [
  'isEmailVerified',
  'isPhoneVerified',
  /** This is just a shorcut for hasPassedKyc: 'success' and will be more stricktly checked securitywise */
  'hasPassedKyc',
  'isLocked',
  'hasAgreedWithTermsAndConditions',
  'isDeleted',
  'isCompanyRepresentative',
  'isFinanceAdmin',
  'isComplianceAdmin',
] as const

export type AllPermissions = typeof allPermissions[number]



//----------------------------------------
// DEFAULT PERMISSIONS
//----------------------------------------
/* those will be used as default values for permission checks, so for example the value is
 * { isLocked: false }, the isLocked check will happen everytime on top of other contextual
 * checks
 */
export const defaultPermRestrictionForAll = {
  isLocked: false,
  isDeleted: false,
  hasAgreedWithTermsAndConditions: true,
} satisfies Partial<Record<AllPermissions, boolean>>

export const defaultPermRestrictionForRole = {
  appUser: { isPhoneVerified: true },
  bangkAdmin: {},
  icoInvestor: { isEmailVerified: true },
} satisfies Record<AllRoles, Partial<Record<AllPermissions, boolean>>>