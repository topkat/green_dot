

import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { ForClauseWithAll, ForClauseParsedWithAll, ForClauseParsed } from '../../types/core.types'

import { asArray } from 'topkat-utils'



/** Merge default permissions and replace ALL by all permissions */
export async function parseForClause<T extends ForClauseParsedWithAll | ForClauseWithAll<any>>(
  forClause: T
): Promise<ForClauseParsed[]> {

  const { allRoles } = getMainConfig()

  const forClauseArr = asArray(forClause) as T extends any[] ? T : T[]

  const output = []

  for (const pRaw of forClauseArr) {

    const p = typeof pRaw === 'string' ? { role: pRaw } : pRaw

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
  } as ForClauseParsed
}