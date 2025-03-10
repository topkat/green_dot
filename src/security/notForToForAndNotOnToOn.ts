
import { daoGenericMethods, DaoGenericMethods } from '../types/core.types'
import { serverConfig } from '../cache/green_dot.app.config.cache'
import { includes } from 'topkat-utils'



export function notForToFor<Roles extends Ctx['role']>(notForHook: Roles[]): Roles[] {
  if (includes(notForHook, 'ALL')) return []
  else return serverConfig.allRoles.filter(role => !notForHook.includes(role))
}

export function notOnToOn(notOnHook: DaoGenericMethods[]): DaoGenericMethods[] {
  return [...daoGenericMethods].filter(methodName => !notOnHook.includes(methodName))
}

