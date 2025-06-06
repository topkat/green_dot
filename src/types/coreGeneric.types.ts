import { MaybeArray } from 'typescript-generic-types'

export const allString = 'ALL'
export type AllString = typeof allString


type CtxPermsPlusAny = Partial<
  Record<
    keyof UserPermissionsWithoutRolePerms & (`is${string}` | `has${string}`), // this is a hack, I have been having a lot of problems with that
    boolean | 'any'
  >
>

export type ForClauseParsed<AdditionalRoles = never> = CtxPermsPlusAny & { role: Ctx['role'] | AdditionalRoles }

/** Each item in the array is a OR */
export type ForClause = MaybeArray<Ctx['role'] | ForClauseParsed>

export type ForClauseWithAll<AdditionalRoles = never> = MaybeArray<AdditionalRoles | Exclude<Ctx['role'], 'system'> | 'ALL' | ForClauseParsed<AdditionalRoles>>

export type ForClauseWithAllAndSystem<AdditionalRoles = never> = MaybeArray<AdditionalRoles | Ctx['role'] | 'ALL' | ForClauseParsed<AdditionalRoles>>

export type ForClauseParsedWithAll = Array<CtxPermsPlusAny & { role: Ctx['role'] | 'ALL' }>

export type ApiOutputTypes = 'json' | 'xml' | 'file' | 'download' | 'raw' | 'docx' | 'bufferObject' | 'excel'

export type CountryCodeIso = `${Letters}${Letters}`
export type TranslationObj = { [countryIsoCode in CountryCodeIso]?: string }

export const defaultPermissions = ['isEmailVerified', 'isPhoneVerified', 'isLocked', 'isDeleted'] as const
export type DefaultPermissions = typeof defaultPermissions[number]
export type DefaultRoles = 'public'