import { DaoGenericMethods, DaoSharedParsed } from '../../types/daoGeneric.types'
import { daoMethodsGenericToDaoMethodFull, MongoDaoMethodsFull } from '../mongo/types/mongoDaoTypes'

import { pushIfNotExist } from 'topkat-utils'

type RoleAndPublic = Exclude<Ctx['role'], 'system'>

export function getApiEndpointsPerRolesFromDao(
  exposes: DaoSharedParsed['expose'] = [],
  allRoles: readonly Exclude<Ctx['role'], 'system' | 'public'>[], ///!\ Do not use severConfig here since it's used in test env
) {

  const genericMethodsPerRole = {} as { [role in RoleAndPublic]: DaoGenericMethods[] }
  const fullMethodsPerRole = {} as { [role in RoleAndPublic]: MongoDaoMethodsFull[] }
  const authorizedApiEndpoint = [] as MongoDaoMethodsFull[]
  const allRolesAndPublic = [...allRoles, 'public' as const]


  for (const role of allRolesAndPublic) {
    genericMethodsPerRole[role] ??= []
    fullMethodsPerRole[role] ??= []

    for (const exposeConf of exposes) {
      const { expose, for: forClauses } = exposeConf

      for (const forClause of forClauses) {
        if (role === forClause.role || forClause.role === 'public') {
          pushIfNotExist(genericMethodsPerRole[role], expose)
          for (const exps of expose) {
            pushIfNotExist(fullMethodsPerRole[role], daoMethodsGenericToDaoMethodFull[exps])
            pushIfNotExist(authorizedApiEndpoint, daoMethodsGenericToDaoMethodFull[exps])
          }
        }
      }
    }
  }

  return { genericMethodsPerRole, fullMethodsPerRole, authorizedApiEndpoint }
}