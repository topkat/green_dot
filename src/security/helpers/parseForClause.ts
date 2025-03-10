

import { ForClauseWithAll, ForClauseParsedWithAll, ForClauseParsed, ForClauseItem } from '../../types/core.types'
import { serverConfig } from '../../cache/green_dot.app.config.cache'

import { asArray } from 'topkat-utils'



/** Merge default permissions and replace ALL by all permissions */
export function parseForClause<T extends ForClauseParsedWithAll | ForClauseWithAll<string>>(
  forClause: T
): ForClauseParsed[] {

  const forClauseArr = asArray(forClause) as T extends any[] ? T : T[]

  const output = forClauseArr.map(p => {
    if (typeof p === 'string') p = { role: p }
    if (p.role === 'public') return p as ForClauseParsed
    const defaultPerms = getDefaultPerms(p.role, p)

    for (const k in defaultPerms) {
      if (defaultPerms[k] === 'any') delete defaultPerms[k]
    }
    return defaultPerms
  })

  if (output.some(p => p.role === 'public')) return [{ role: 'public' }]
  else if (output.some(p => (p.role as any) === 'ALL')) return serverConfig.allRoles.map(role => ({ role }))
  else return output
}


function getDefaultPerms(role: string, toMerge = {}) {
  return {
    ...(serverConfig.defaultPermForAll || {}),
    ...(serverConfig.defaultPermForRole?.[role] || {}),
    ...toMerge,
  } as ForClauseItem
}