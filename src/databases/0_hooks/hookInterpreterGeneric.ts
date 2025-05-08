

import { error } from '../../error'
import { DaoHookShared, daoGenericMethods, DaoGenericMethods, DaoHookSharedParsed } from '../../types/core.types'
import { DaoHookNamesMongo, MongoDaoParsed } from '../mongo/types/mongoDbTypes'
import { hookValidators, HookValidator } from './hookValidators'
import { notForToFor, notOnToOn } from '../../security/notForToForAndNotOnToOn'

import { isset, noDuplicateFilter, isObject, asArray } from 'topkat-utils'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'

/** Parse all 'for', 'on', 'notFor' and 'notOn' clauses + apply the custom hook interpreter */
export async function genericHookInterpreter<HookName extends DaoHookNamesMongo>(
    modelName: string,
    hookIndex: number,
    hookName: HookName,
    hook: DaoHookShared & { hasBeenValidated?: boolean },
    allRoles?: readonly Ctx['role'][],
): Promise<MongoDaoParsed<any>[HookName]> {

    const mainConfig = getMainConfig()

    allRoles ??= mainConfig.allRoles

    const hookInterpreter: HookValidator = hookValidators[hookName]
    const getAllRolesPerms = () => allRoles.map(r => ({ role: r }))

    if (typeof hook === 'object' && hook.hasBeenValidated) return hook as MongoDaoParsed<any>[HookName]
    else {

        if (isObject(hook)) {
            hook.hasBeenValidated = true
            const hookDefault: Partial<DaoHookSharedParsed> = {
                for: hook?.notFor?.length ? [] : getAllRolesPerms(),
                on: hook?.notOn?.length ? [] : [...daoGenericMethods],
                priority: 50,
            }

            if (!isset(hookInterpreter)) throw error.serverError(`PLEASE PROVIDE A VALIDATOR FOR ${hookName} HOOK`)

            // convert all possible as array syntax
            for (const fnName of ['for', 'notFor', 'on', 'notOn', 'expose']) {
                if (typeof hook[fnName] === 'string') hook[fnName] = [hook[fnName]]
            }

            // PARSE FOR
            let newForClause = hook?.notFor?.length ? notForToFor(asArray(hook.notFor)) : (asArray(hook.for) || hookDefault.for)
            delete hook.notFor

            if (newForClause.some(f => f === 'ALL')) {
                // usually public is not included in ALL so you have to include it explicitely. Likle: ['ALL', 'public']
                const containsPublic = newForClause.some(f => f === 'public' || (f as any).role === 'public')
                // Convert ALL to all perms
                newForClause = getAllRolesPerms()
                if (containsPublic) newForClause.push({ role: 'public' })
            } else {
                // Convert string role to { role: 'Role' }
                newForClause = newForClause.map(role => typeof role === 'string' ? { role } : role) as any[]
            }

            hook = {
                ...hookDefault,
                ...hook,
                for: newForClause,
            }

            // PARSE METHOD (update, create, getOne...)
            for (const hookType2 of ['on', 'notOn', 'expose'] as const) {
                if (!hook[hookType2]) continue
                if (hookType2 === 'expose' && 'expose' in hook === false) continue
                if (hook[hookType2].includes('ALL')) hook[hookType2] = [...daoGenericMethods]
                else {
                    if (hook[hookType2].includes('write')) hook[hookType2].push('create', 'update', 'delete')
                    if (hook[hookType2].includes('read')) hook[hookType2].push('getAll', 'getOne')
                    hook[hookType2] = hook[hookType2].filter(h => h !== 'read' && h !== 'write')
                }
            }

            hook.on = noDuplicateFilter(hook.on as DaoGenericMethods[]).filter(meth => daoGenericMethods.includes(meth))

            // convert notOn to on
            if (hook?.notOn?.length) hook.on = notOnToOn(hook.notOn as DaoGenericMethods[])
            delete hook.notOn
        }

        // validate hook
        if (!hookInterpreter.validate(hook)) {
            throw error.serverError(
                hookInterpreter.errMsg || `${modelName}.hooks.${hookName}[${hookIndex}] format not valid for hook`,
                { daoName: modelName, hookType: hookName, hookIndex, hook: JSON.stringify(hook, null, 2) }
            )
        }

        return hook as MongoDaoParsed<any>[HookName]
    }
}