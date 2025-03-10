
import { TechnicalRoles } from './core.types'

export const allString = 'ALL'
export type AllString = typeof allString

export type RolesPlusTechnicals = Ctx['role'] | TechnicalRoles

type CtxPermsPlusAny = {
  [K in keyof Ctx['permissionsWithoutRolePermissions']]: Ctx['permissionsWithoutRolePermissions'][K] | 'any'
}


export type ForClauseItem<AdditionalRoles = never> = { role: RolesPlusTechnicals | AdditionalRoles } & CtxPermsPlusAny

/** used in dao testing */
export type ForClauseAndAllWithoutFunction<AdditionalRoles = never> = MaybeArray<RolesPlusTechnicals | 'ALL' | ForClauseItem<AdditionalRoles>>

/** Each item in the array is a OR */
export type ForClause = MaybeArray<RolesPlusTechnicals | ({ role: Ctx['role'] } & CtxPermsPlusAny)>

export type ForClauseWithAll<AdditionalRoles = never> = MaybeArray<AdditionalRoles | Exclude<RolesPlusTechnicals, 'system'> | 'ALL' | ForClauseItem<AdditionalRoles>>

export type ForClauseWithAllAndSystem<AdditionalRoles = never> = MaybeArray<AdditionalRoles | RolesPlusTechnicals | 'ALL' | ForClauseItem<AdditionalRoles>>

export type ForClauseParsed = ForClauseItem

export type ForClauseParsedWithAll = Array<({ role: RolesPlusTechnicals | 'ALL' } & CtxPermsPlusAny)>

export type ApiOutputTypes = 'json' | 'xml' | 'file' | 'download' | 'raw' | 'docx' | 'bufferObject' | 'excel'