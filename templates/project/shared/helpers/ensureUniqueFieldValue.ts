

import { ModelTypes, db, generateUniqueToken, ModelNamesForDb, MainDbName } from 'green_dot'


/** Will generate a token and check that no model exists with that new field value */
export async function ensureUniqueFieldValue<T extends ModelNamesForDb[MainDbName]>(
    ctx: Ctx,
    modelName: T,
    fieldName: keyof ModelTypes[T],
    tokenLength: number,
    tokenModifier: (token: string) => string = t => t,
) {
    let uniqueId: string
    do {
        uniqueId = tokenModifier(generateUniqueToken(tokenLength))
    } while (await db[modelName].count(ctx.GM, { [fieldName]: uniqueId } as any))
    return uniqueId
}