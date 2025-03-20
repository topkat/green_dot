
import { applyMaskOnObjectForUser } from './maskService'
import { LocalConfigParsed } from '../types/mongoDbTypes'

/** Prevent user filtering on unauthorized fields. Eg: getAllUsers({ password: '1234' })
 * Mainly used to sanitize filter sent from front end
 * * Validating all first level $or conditions and preventing nested ones
 * * Preventing use of unauthorized first level operators like $and, $nor, $not
 */
export async function mongoSanitizeFilter(ctx: Ctx, localConfig: LocalConfigParsed) {

    if (ctx.isSystem) return

    const { method, dbName, modelName } = localConfig

    if (localConfig.filter === undefined || Object.keys(localConfig.filter || {})?.length === 0) return

    // HARD KORE SANITIZE FUNCTION no mongo operator should be used by the frontend

    if (ctx.isFromGeneratedDbApi && !localConfig.filterSanitized) {
        const filterStringified = JSON.stringify(localConfig.filter)

        if (/"\$[^"]+"/.test(filterStringified)) {
            await ctx.addWarning()
            throw ctx.error.filterWithMongoOperatorsNotAllowed({ filter: localConfig.filter })
        }

        localConfig.filterSanitized = true // avoid to be triggered twice (for ex on update + read after updt)
    }

    localConfig.filter = await applyMaskOnObjectForUser(ctx, dbName, modelName, method, localConfig.filter)


    // const { $or, ...firstLevelFilter } = localConfig.filter


    // const unauthorizedOperators = ['$and', '$nor', '$not', '$where', '$exec', '$ne']

    // // FIRST LEVEL
    // localConfig.filter = await applyMaskToFilter(firstLevelFilter)

    // if ($or && $or.length && $or.length <= 4) {
    //     const newOrConditions = []
    //     for (const filter of $or) {
    //         const newFilter = await applyMaskToFilter(filter)
    //         if (Object.keys(newFilter)?.length) newOrConditions.push(newFilter)
    //     }
    //     if (newOrConditions.length) localConfig.filter.$or = newOrConditions
    // } else if ($or?.length > 4) C.error(false, '$OR filter has been deleted because it cannot be > 4')


    // async function applyMaskToFilter<T>(filter: AsFilter<T>): Promise<AsFilter<T>> {
    //     // if (Object.keys(filter).some(f => f.startsWith('$'))) errors.wrongValueForParam(ctx, { message: `unauthorizedFilter`, filter: localConfig.filter, unauthorized: Object.keys(filter).filter(f => f.startsWith('$')) })
    //     // MASK UNAUTHORIZED DATA IN FILTER
    //     const newFilter = await applyMaskOnObjectForUser(ctx, dbName, modelName, method, filter) // masking shall not impact query operators ($ne, $gte...) since they are not supposed to be 1st level
    //     // for (const unauthorized of unauthorizedOperators) {
    //     //     if (unauthorized in newFilter) delete newFilter[unauthorized]
    //     // }
    //     return newFilter
    // }
}