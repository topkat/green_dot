import { getMainConfig } from '../../helpers/getGreenDotConfigs.js'
import { DaoGenericMethods, DaoSharedParsed } from '../../types/daoGeneric.types.js'
import { daoMethodsGenericToDaoMethodFull, MongoDaoMethodsFull } from '../mongo/types/mongoDaoTypes.js'

import { pushIfNotExist } from 'topkat-utils'

type RoleAndPublic = Exclude<Ctx['role'], 'system'>

export function getApiEndpointsPerRolesFromDao(
  exposes: DaoSharedParsed['expose'] = [],
) {

  const mainConfig = getMainConfig()
  const { allRoles } = mainConfig

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
        if (role === forClause.role || (forClause.role as any) === 'public') {
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