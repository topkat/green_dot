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
  /** Configure what is exposed to outside world via API and the permission that is allowed to read / write the model.
   * * To have more granularity on which fields should be exposed or which document should be accessed use dao.mask or dao.filter.
   * * Leave the array empty is you don't want to expose your model and want to use it only internally (via dbs.myDb.myModel...)
   * * Use snippet `gd_dao:expose` for autocompletion
   *
   * Example:
   * ```typescript
   * const dao = { expose: [{
        for: ['user', 'perm2'], // only those perms will have access to your model
        expose: ['getOne', 'update'], // only those methods will be allowed for those perms
    },{
        // you can mix and match with all your perms
        for: ['admin'],
        expose: ['read', 'write'],
    },
]}
   * ```
  */
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
   * * It masks selected fields and consider that **all paths are allowed by default**
   * * One important thing to consider: when multiple mask/select hooks apply, the more restrictive result is applied. Eg: if path1 is masked on one hook and path2 is allowed on a second, it will be masked
   * * Should return an object like: `{ authorized: { path: true, sub: { path: true }, matchWildCardProp: { 'admin*': true }, '*': true }}`
   * * Use snippet `gd_dao:mask` for autocompletion
   *
   * Example:
   * ```typescript
   * const dao = { mask: [{
        notFor: 'admin',
        on: 'ALL', // for read / update / create... or dismiss this field for the same result
        mask: () => ({
            companyMargin: true, // those are masked for everyone except admins
            stats: true,
        }),
    },
   * ```
   */
  mask(ctx: Ctx): RecursiveObjValueType<Partial<ModelType>, boolean>
  select?: never
} | {
  /** Define which path should be SELECTED
   * * It will select configured fields and **mask all other paths**
   * * One important thing to consider: when multiple mask/select hooks apply, the more restrictive result is applied. Eg: if path1 is masked on one hook and path2 is allowed on a second, it will be masked
   * * Should return an object like: `{ authorized: { path: true, sub: { path: true }, matchWildCardProp: { 'admin*': true }, '*': true }}`
   * * Use snippet `gd_dao:mask` for autocompletion
   *
   * Example:
   * ```typescript
   * const dao = { mask: [{
        notFor: 'admin',
        on: 'ALL', // for read / update / create... or dismiss this field for the same result
        select: () => ({
            firstName: true, // those fields are visible for everyone except admins, all others fields are masked
            lastName: true,
        }),
    },
   * ```
   */
  select(ctx: Ctx): RecursiveObjValueType<Partial<ModelType>, boolean>
  mask?: never
}