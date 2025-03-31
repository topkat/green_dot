

import { ForClauseParsed } from '../types/core.types'

import { asArray } from 'topkat-utils'

export async function doPermApplyToCtx(
    ctx: Ctx,
    expectedPermissions: MaybeArray<ForClauseParsed>,
    /** Define which value should be returned when ctx.isSystem.
     * * => 'matchStrict' will search for an exact matching perm in forPerms
     * * => 'matchAll' will search for a matching perm in forPerms, including 'ALL' perm
     */
    returnValueIfSystem: 'alwaysReturnTrue' | 'alwaysReturnFalse' | 'matchStrict' | 'matchAll',
    /** Define which value should be returned when ctx.isPublic.
     * * => 'matchStrict' will search for an exact matching perm in forPerms
     * * => 'matchAll' will search for a matching perm in forPerms, including 'ALL' perm
     */
    returnValueIfPublic: 'alwaysReturnTrue' | 'alwaysReturnFalse' | 'matchStrict' | 'matchAll',
    /** If forPerm includes public, what shall be returned for a user with a perm 'user' for example? */
    returnValueIfForPermContainsPublic: 'alwaysReturnTrue' | 'alwaysReturnFalse' | 'match'
): Promise<boolean> {

    const expectedPermArr = asArray(expectedPermissions)


    const permsThatApplyToUser = []

    const publicTargeted = expectedPermArr.some(p => p.role === 'public')
    const systemTargeted = expectedPermArr.some(p => p.role === 'system')

    if (ctx.isSystem) {
        if (systemTargeted) return true
        else if (returnValueIfSystem === 'alwaysReturnFalse') return false
        else if (returnValueIfSystem === 'alwaysReturnTrue') return true
        else if (returnValueIfSystem === 'matchAll') permsThatApplyToUser.push('ALL')
    } else if (ctx.isPublic) {
        if (publicTargeted) return true
        else if (returnValueIfPublic === 'alwaysReturnFalse') return false
        else if (returnValueIfPublic === 'alwaysReturnTrue') return true
        else if (returnValueIfPublic === 'matchAll') permsThatApplyToUser.push('ALL')
    }

    if (publicTargeted) {
        if (returnValueIfForPermContainsPublic === 'alwaysReturnFalse') return false
        else if (returnValueIfForPermContainsPublic === 'alwaysReturnTrue') return true
    }

    if (ctx.isSystem) permsThatApplyToUser.push('system')
    else if (ctx.isPublic) permsThatApplyToUser.push('public')
    else permsThatApplyToUser.push('ALL', ctx.role)

    return expectedPermArr.some(p => {
        const { role, ...permissions } = p
        return doPermAndRoleMatch(permsThatApplyToUser, role, ctx.permissions, permissions)
    })
}





function doPermAndRoleMatch(
    inputRole: string | string[],
    expectedRole: string,
    inputPermissions = {},
    expectedPermissions = {}
) {
    const roleMatch = expectedRole ? asArray(inputRole).includes(expectedRole) : true
    let permissionMatch = true
    for (const [permName, expectedPermValue] of Object.entries(expectedPermissions)) {
        const userPerm = typeof inputPermissions[permName] !== 'undefined' ? inputPermissions[permName] : false
        if (userPerm !== expectedPermValue) {
            permissionMatch = false
        }
    }
    /** Every permissions should match here */
    // const permMatch = permissions.length ? permissions.every(p => p ) : true
    return roleMatch && permissionMatch
}