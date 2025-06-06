
import { LocalConfigParsed } from './types/mongoDbTypes.js'
import { hookInterpreterExpose } from '../0_hooks/hookInterpreterExpose.js'
import { mongoFilterHookInterpreter } from './hooks/mongoFilterHookInterpreter.js'
import { mongoSanitizeFilter } from './services/mongoSanitizeFilter.js'

import { unPopulate } from './services/populateService.js'
import { applyMaskIncludingOnPopulatedFieldsRecursive } from './services/maskService.js'
import event from '../../event.js'

import { getId } from 'topkat-utils'
import { getProjectDatabaseModels } from '../../helpers/getProjectModelsAndDaos.js'

export async function mongoBeforeRequest(
    ctx: Ctx,
    localConfig: LocalConfigParsed,
): Promise<void> {
    localConfig.ressourceId = getId(localConfig.inputFields) || getId(localConfig?.filter)

    const { modelName, method, dbName, dbId, ressourceId } = localConfig

    const hasFields = localConfig.inputFields && Object.keys(localConfig.inputFields).length

    const errExtraInfos = { modelName, dbName, dbId, method }

    await hookInterpreterExpose(ctx, dbId, dbName, method, modelName) // may throw

    await mongoSanitizeFilter(ctx, localConfig)

    // APPLY SECURITY FILTERS
    await mongoFilterHookInterpreter(ctx, localConfig)

    // EMIT "BEFORE" EVENTS
    // they are applied after security so that every changes that are made by an event is made as a system eventhough the ctx used is a normal one
    if (!ctx.simulateRequest && !localConfig.disableEmittingEvents) {
        const eventName = `${modelName}.${method}.before` // user.create.before

        // all that mess to keep type safe on ctx, ctx has different type depending on the method (getOne, update...)
        if (method === 'create') {
            await event.emit(
                `${modelName}.create.before`,
                ctx.clone({ ...localConfig, method, inputFields: localConfig.inputFields, createdId: localConfig.inputFields._id })
            )
        } else if (method === 'update') {
            if (!localConfig.ressourceId && event.registeredEvents[eventName] && event.registeredEvents[eventName].length) {
                throw ctx.error.serverError(`An event is registered on this request. When updating all, please use 'disableEmittingEvents' in request config, so that you make sure event emitting is bypassed. Actually updating all is not compatible with event emitting, because you wont get the id of the updated field`)
            }
            await event.emit(
                `${modelName}.update.before`,
                ctx.clone({ ...localConfig, method, updatedId: ressourceId, inputFields: localConfig.inputFields })
            )
        } else if (method === 'getOne') {
            await event.emit(
                `${modelName}.getOne.before`,
                ctx.clone({ ...localConfig, method })
            )
        } else if (method === 'getAll') {
            await event.emit(
                `${modelName}.getAll.before`,
                ctx.clone({ ...localConfig, method })
            )
        } else if (method === 'delete') {
            await event.emit(
                `${modelName}.delete.before`,
                ctx.clone({ ...localConfig, method, deletedId: ressourceId })
            )
        } else throw ctx.error.serverError('notExistingMethod', { method })
    }

    if (hasFields) {

        await unPopulate(dbName, modelName, localConfig.inputFields)

        // MASK UNAUTHORIZED DATA IN BODY
        localConfig.inputFields = await applyMaskIncludingOnPopulatedFieldsRecursive(ctx, method, dbName, modelName, localConfig.inputFields, false)

        // CHECK TYPES AND FORMAT DATA
        const dbs = await getProjectDatabaseModels()
        const validator = dbs[dbName][modelName]
        localConfig.inputFields = await validator.formatAndValidate(localConfig.inputFields, {
            user: ctx.getUserMinimal(),
            method,
            dbName,
            dbId,
            modelName,
            errorExtraInfos: errExtraInfos
        })
    }

    if (method === 'update' && hasFields) delete localConfig.inputFields._id // this is here so in an event we can still rely on fields._id if needed, the best way is to use ctx.ressourceId
}