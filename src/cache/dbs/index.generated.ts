
import { AllModels as AdminAllModels } from './admin.modelTypes.generated'
import { AllModels as BangkAllModels } from './bangk.modelTypes.generated'
import { AllModels as WebsiteAllModels } from './website.modelTypes.generated'


export type ModelsWithDbNamesAndReadWrite = {
    admin: AdminAllModels
    bangk: { [K in keyof BangkAllModels]: K extends 'user' ? BangkAllModels[K] & { Read: UserPermissionFields, Write: Partial<UserPermissionFields> } : BangkAllModels[K] }
    website: WebsiteAllModels
}

export type DbIds = {
    admin: 'model1' | 'model2'
    bangk: 'model3'
    website: 'model4'
}

export type MainDbName = 'bangk'

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
