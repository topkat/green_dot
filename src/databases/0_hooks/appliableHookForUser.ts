
import { doPermApplyToCtx } from '../../security/doPermApplyToCtx.js'
import { DaoGenericMethods, DaoHookSharedParsed } from '../../types/core.types.js'

type PublicAndSystemApplyToAllValues = Parameters<typeof doPermApplyToCtx>[2]

export async function appliableHooksForUser<Hook extends Partial<DaoHookSharedParsed>[]>(
    ctx: Ctx,
    hooks: Hook,
    method: DaoGenericMethods,
    /** Define which value should be returned when ctx.isSystem.
     * * => 'matchStrict' will search for an exact matching perm in forPerms
     * * => 'matchAll' will search for a matching perm in forPerms, including 'ALL' perm
     */
    systemPermApplyWhenAll: PublicAndSystemApplyToAllValues,
    /** Define which value should be returned when ctx.isPublic.
    * * => 'matchStrict' will search for an exact matching perm in forPerms
    * * => 'matchAll' will search for a matching perm in forPerms, including 'ALL' perm
    */
    returnValueIfPublic: PublicAndSystemApplyToAllValues | ((hook: Hook[number]) => PublicAndSystemApplyToAllValues),
    /** If forPerm includes public, what shall be returned for a user with a perm 'user' for example? */
    returnValueIfForPermContainsPublic: 'alwaysReturnTrue' | 'alwaysReturnFalse' | 'match' = 'match'
): Promise<Hook> {

    const appliableHooks = [] as any as Hook
    for (const hookObj of hooks) {
        if ((hookObj.on || []).includes(method) && await doPermApplyToCtx(
            ctx,
            hookObj.for || [],
            systemPermApplyWhenAll,
            typeof returnValueIfPublic === 'function' ? returnValueIfPublic(hookObj) : returnValueIfPublic,
            returnValueIfForPermContainsPublic,
        )) {
            appliableHooks.push(hookObj)
        }
    }

    return appliableHooks
}