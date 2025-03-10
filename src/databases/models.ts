

/** /!\ Try to import the lesser because it is used in build /!\ */
import type { Definition } from 'good-cop/backend'
import { objForceWrite, DescriptiveError } from 'topkat-utils'
import { MongoDaoParsed } from './mongo/types/mongoDbTypes'

export type Models = typeof models

export const models = {
    mongo: {} as { [dbId: string]: { [modelName: string]: Record<string, any> } }, // do not refactor type here because less readable on intellisense
    daos: {} as { [dbId: string]: { [modelName: string]: MongoDaoParsed<any> } },
    populateAddrFlatWithModelName: {} as { [dbId: string]: { [modelName: string]: { [populatedFieldNameFlat: string]: string } } },
    validation: {} as { [dbId: string]: { [modelName: string]: Definition } },
}

export function registerModel(
    dbType: 'mongo',
    dbName: string,
    modelName: string,
    model: Definition,
    dao?: MongoDaoParsed<any>
) {
    try {
        if (!models.validation?.[dbName]?.[modelName]) {
            const modelAddr = `${dbName}.${modelName}`
            objForceWrite(models.validation, modelAddr, model)

            if (dbType === 'mongo') {
                const modelFlatWithRefs = model._getDefinitionObjFlat(false, def => def._refValue)

                const mongoSchemas = model._getMongoType() as Record<string, any>

                objForceWrite(models.mongo, modelAddr, mongoSchemas)
                objForceWrite(models.populateAddrFlatWithModelName, modelAddr, modelFlatWithRefs)
                objForceWrite(models.daos, modelAddr, dao)
            }
        }
    } catch (err) {
        throw new DescriptiveError('Error while registering models', { err, dbName, modelName })
    }
}