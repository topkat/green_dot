
import { asArray, pushIfNotExist } from 'topkat-utils'
import { ServiceClean } from '../../types/core.types'

export function getAllTargetRolesForService(
  allRoles: readonly string[],
  exposes: ServiceClean['for'] = []
) {

  const allRolesForService = []

  for (const exposeConf of asArray(exposes)) {
    const { role } = typeof exposeConf === 'string' ? { role: exposeConf } as const : exposeConf
    pushIfNotExist(allRolesForService, role === 'public' ? allRoles : role)
  }

  return allRolesForService
}