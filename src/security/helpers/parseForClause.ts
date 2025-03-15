

import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { ForClauseWithAll, ForClauseParsedWithAll, ForClauseParsed, ForClauseItem } from '../../types/core.types'

import { asArray } from 'topkat-utils'



/** Merge default permissions and replace ALL by all permissions */
export async function parseForClause<T extends ForClauseParsedWithAll | ForClauseWithAll<string>>(
  forClause: T
): Promise<ForClauseParsed[]> {

  const { allRoles } = getMainConfig()

  const forClauseArr = asArray(forClause) as T extends any[] ? T : T[]

  const output = []

  for (let p of forClauseArr) {

    if (typeof p === 'string') p = { role: p }

    if (p.role === 'public') {
      output.push(p as ForClauseParsed)
    } else {
      const defaultPerms = await getDefaultPerms(p.role, p)

      for (const k in defaultPerms) {
        if (defaultPerms[k] === 'any') delete defaultPerms[k]
      }
      output.push(defaultPerms)
    }
  }

  if (output.some(p => p.role === 'public')) return [{ role: 'public' }]
  else if (output.some(p => (p.role as any) === 'ALL')) return allRoles.map(role => ({ role }))
  else return output
}


async function getDefaultPerms(role: string, toMerge = {}) {
  const mainConfig = getMainConfig()
  return {
    ...(mainConfig.defaultPermRestrictionForAll || {}),
    ...(mainConfig.defaultPermRestrictionForRole?.[role] || {}),
    ...toMerge,
  } as ForClauseItem
}