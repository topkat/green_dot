
import { getMainConfig } from '../helpers/getGreenDotConfigs'
import { daoGenericMethods, DaoGenericMethods } from '../types/core.types'
import { includes } from 'topkat-utils'



export function notForToFor<Roles extends Ctx['role']>(notForHook: Roles[]): Roles[] {
  if (includes(notForHook, 'ALL')) return []
  else {
    const mainConfig = getMainConfig()
    return (mainConfig.allRoles as Roles[]).filter(role => !notForHook.includes(role))
  }
}

export function notOnToOn(notOnHook: DaoGenericMethods[]): DaoGenericMethods[] {
  return [...daoGenericMethods].filter(methodName => !notOnHook.includes(methodName))
}

