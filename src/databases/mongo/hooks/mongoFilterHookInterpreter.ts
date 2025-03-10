
import { appliableHooksForUser } from '../../0_hooks/appliableHookForUser'
import { LocalConfigParsed, MongoDaoParsed } from '../types/mongoDbTypes'

import { isObject } from 'topkat-utils'

/** modify passed filter to take in account access or permissions filter. Eg: a user has only access to users of his company,
 * so we'll want the filter to be like getAllUsers({ company: ctx.user.company }) */
export async function mongoFilterHookInterpreter(ctx: Ctx, config: LocalConfigParsed, hooks: MongoDaoParsed<any>['filter'] = []) {
    if (ctx.isSystem) return true
    const filterHooksForUser = await appliableHooksForUser(ctx, hooks, config.method, 'alwaysReturnFalse', 'alwaysReturnTrue')
    // if (config.isHardDelete === false && !config.withDeleted) config.filter.isDeleted = { $in: [null, false] }

    for (const { filter } of filterHooksForUser) {
        const improvedCtx = { ...config, ...ctx } as Ctx & LocalConfigParsed
        const result = await filter(improvedCtx, config.filter) // user can modify filter by reference OR return a new filter
        if (isObject(result)) config.filter = result as any
    }
}