
import { MergeMultipleObjects } from 'typescript-generic-types'
import { UserAdditionalFieldsRead, UserAdditionalFieldsWrite } from '../../security/userAndConnexion/userAdditionalFields'
import { AllModels as MainDbAllModels } from './mainDb.modelTypes.generated'



export const defaultDbName = 'mainDb'

export type ModelsWithDbNamesAndReadWrite = {
    mainDb: { [K in keyof MainDbAllModels]: K extends 'user' ? MainDbAllModels[K] & { Read: UserPermissionFields & UserAdditionalFieldsRead, Write: Partial<UserPermissionFields & UserAdditionalFieldsWrite> } : MainDbAllModels[K] }
}

export type DbIds = {
    mainDb: 'mainDb'
}

export type AllDbIds = DbIds[keyof DbIds]

export type MainDbName = 'mainDb'

export type ModelsWithReadWrite = MergeMultipleObjects<ModelsWithDbNamesAndReadWrite>

/** With this getter you can safely use your model types anywhere (even in db folders).
If you use straight type like ```User```, it may error when you are in a database folder
 * @example ```type User = ModelTypes['user']```
*/
export type ModelTypes = {
    [K in keyof ModelsWithReadWrite]: ModelsWithReadWrite[K]['Read']
} & {
    [K in keyof ModelsWithReadWrite as `${K & string}Write`]: ModelsWithReadWrite[K]['Write']
}

/** All ModelNames for all DB Names: 'modelName1' | 'modelName2'...  */
export type ModelNames = keyof ModelsWithReadWrite

/** ModelNames for DB { [dbName]: 'modelName1' | 'modelName2'... } */
export type ModelNamesForDb = { [K in keyof ModelsWithDbNamesAndReadWrite]: keyof ModelsWithDbNamesAndReadWrite[K] }
