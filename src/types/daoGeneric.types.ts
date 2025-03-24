

import { MongoDao, MongoDaoMethodsFull } from '../databases/mongo/types/mongoDbTypes'
import { allString, ForClauseWithAllAndSystem, ForClauseParsed } from './coreGeneric.types'


//----------------------------------------
// DAO
//----------------------------------------

export const writeMethods = ['create', 'update', 'delete'] as const
export type WriteMethods = typeof writeMethods[number]

export const readMethods = ['getOne', 'getAll'] as const
export type ReadMethods = typeof readMethods[number]

export const daoGenericMethods = [...writeMethods, ...readMethods] as const
export type DaoGenericMethods = typeof daoGenericMethods[number]

export const daoMethodsWithReadWrite = [...daoGenericMethods, 'write', 'read'] as const
export type DaoMethodsWithReadWrite = typeof daoMethodsWithReadWrite[number]

const daoMethodsGenericAndAll = [...daoMethodsWithReadWrite, allString] as const
type DaoMethodsGenericAndAll = typeof daoMethodsGenericAndAll[number]

export type AllPossibleDaoMethods = MongoDaoMethodsFull



export type GenericDao = MongoDao<any>


export type DaoSharedParsed = {
  /** Define a global access permissions on a model for a certain user role */
  expose: (Omit<DaoHookSharedParsed, 'on'> & { expose?: DaoGenericMethods[] })[]
}

export type ExposeDaoConfig = (Omit<DaoHookShared, 'on' | 'notOn'> & { expose?: MaybeArray<DaoMethodsWithReadWrite> })

export type DaoShared = {
  /** Configure what is automatically exposed to outside world via API alongside the permission that is allowed to read / write the model. To have more granularity on which fields should be exposed or which document should be accessed use dao.mask or dao.filter */
  expose?: ExposeDaoConfig[]
}

//----------------------------------------
// DAO HOOKS
//----------------------------------------


export type DaoHookShared = {
  doc?: string
  for?: ForClauseWithAllAndSystem
  notFor?: MaybeArray<Ctx['role']>
  priority?: number
  on?: MaybeArray<DaoMethodsGenericAndAll>
  notOn?: MaybeArray<DaoMethodsWithReadWrite>
}

export type DaoHookSharedParsed = {
  doc?: string
  for: ForClauseParsed[]
  priority: number
  on: DaoGenericMethods[]
}

export const daoHookNamesShared = ['expose'] as const
export type DaoHookNamesShared = typeof daoHookNamesShared[number]


export type MaskHook<ModelType> = {
  /** Define which path should be MASKED
   * * It masks selected fields considering that **all paths are allowed by default**
   * * One important thing to consider: when multiple mask/select hooks apply, the more restrictive result is applied. Eg: if path1 is masked on one hook and path2 is allowed on a second, it will be masked
   * * Should return an object like: `{ authorized: { path: true, sub: { path: true }, matchWildCard: { 'admin*': true }, '*': true }}`
   */
  mask(ctx: Ctx): RecursiveObjValueType<Partial<ModelType>, true>
  select?: never
} | {
  /** Define which path should be SELECTED. Should return an object like
   * * this will select selected fields and **mask all other paths**
   * * One important thing to consider: when multiple mask/select hooks apply, the more restrictive result is applied. Eg: if path1 is masked on one hook and path2 is allowed on a second, it will be masked
   * * Should return an object like: `{ authorized: { path: true, sub: { path: true }, matchWildCard: { 'admin*': true }, '*': true }}`
   */
  select(ctx: Ctx): RecursiveObjValueType<Partial<ModelType>, true>
  mask?: never
}