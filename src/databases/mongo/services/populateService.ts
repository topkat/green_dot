
import { getProjectDatabaseModels } from '../../../helpers/getProjectModelsAndDaos'
import { findByAddressAll, getId, isObject, asArray } from 'topkat-utils'

/** Transform populated fields into their respective _ids. Will modify the passed object */
export async function unPopulate<ModelName extends string>(dbName: string, modelName: ModelName, fields: Record<string, any>) {
    await forEachPopulateField(dbName, modelName, fields, (val, addr, parent) => {
        parent[addr] = val !== null ? getId(val) : val
    })
}

const modelFlatObjCache = {} as { [dbId: string]: { [modelName: string]: { [populatedFieldNameFlat: string]: string } } }

export async function forEachPopulateField<ModelName extends string>(
    dbName: string,
    modelName: ModelName,
    fields: Record<string, any>,
    cb: (fieldValue: string | Record<string, any>, fieldAddrInParent: string | number, parent: MaybeArray<Record<string, any>>, modelName: string, addrFromRoot: string) => MaybePromise<any>,
    recursive = false
) {
    const models = await getProjectDatabaseModels()
    if (!modelFlatObjCache[dbName][modelName]) {
        modelFlatObjCache[dbName] ??= {}
        modelFlatObjCache[dbName][modelName] = models[dbName][modelName]._getDefinitionObjFlat(false, def => def._refValue)
    }
    const populateAddresses = modelFlatObjCache[dbName][modelName]

    // const { populateAddrFlatWithModelName } = models
    // const populateAddresses = populateAddrFlatWithModelName[dbName][modelName]

    for (const [addr, modelName] of Object.entries(populateAddresses)) {
        const actualPopulatedFieldFields = findByAddressAll(fields, addr.replace(/\[\d\]/g, '[*]'), true)

        if (actualPopulatedFieldFields && actualPopulatedFieldFields.length) {

            for (const [addr, valueMaybeArr, lastElmKey, parent] of actualPopulatedFieldFields) { // Eg: ['organizations[0]', { populatedOrg: true }] OR ['organizations[0]', '1234orgId']
                const isArray = Array.isArray(valueMaybeArr)
                let i = 0
                const arrValue = asArray(valueMaybeArr)
                if (!arrValue) continue
                for (const value of arrValue) {
                    await cb(
                        value,
                        isArray ? i : lastElmKey,
                        isArray ? parent[lastElmKey] : parent,
                        modelName,
                        isArray ? addr + `[${i}]` : addr
                    )
                    const updatedValue = isArray ? parent[lastElmKey][i] : parent[lastElmKey] // may have changed reference
                    if (recursive && isObject(updatedValue)) {
                        await forEachPopulateField(dbName, modelName, updatedValue, cb, recursive)
                    }
                    i++
                }
            }
        }
    }
}

// alias for readability
export const forEachPopulateFieldRecursive: typeof forEachPopulateField = async (dbName, modelName, fields, cb) => await forEachPopulateField(dbName, modelName, fields, cb, true)


