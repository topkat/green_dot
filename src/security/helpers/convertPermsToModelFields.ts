

import { _ } from '../../lib/good-cop/src/index.js'
import { capitalize1st } from 'topkat-utils'


const defVal = () => _.boolean().default(false)

/** This one helps to convert a list of roles into boolean values */
export function convertRoleToPermsToModelFields<R extends readonly string[]>(
  roles: R
): Record<`is${Capitalize<R[number]>}`, ReturnType<typeof defVal>> {

  type AddedUserModelPermissionFields = Record<`is${Capitalize<R[number]>}`, ReturnType<typeof defVal>>
  const addedPerms = {} as AddedUserModelPermissionFields
  for (const role of roles) {
    addedPerms['is' + capitalize1st(role)] = defVal()
  }

  return addedPerms
}