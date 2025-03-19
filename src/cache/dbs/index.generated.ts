
import { AllModels as AdminAllModels } from './admin.modelTypes.generated'
import { AllModels as BangkAllModels } from './bangk.modelTypes.generated'
import { AllModels as WebsiteAllModels } from './website.modelTypes.generated'


export type AllModelsWithReadWrite = {
    admin: AdminAllModels
    bangk: { [K in keyof BangkAllModels]: K extends 'user' ? BangkAllModels[K] & { Read: UserPermissionFields, Write: Partial<UserPermissionFields> } : BangkAllModels[K] }
    website: WebsiteAllModels
}

export type DbIds = {
    admin: 'connexionString'
    bangk: 'connexionString'
    website: 'connexionString'
}

export type MainDbName = 'bangk'

type Result = MergeMultipleObjects<AllModelsWithReadWrite>

/** With this getter you can safely use your model types anywhere (even in db folders).
If you use straight type like ```User```, it may error when you are in a database folder
 * @example ```type User = ModelTypes['user']```
*/
export type ModelTypes = {
    [K in keyof Result]: Result[K]['Read']
} & {
    [K in keyof Result as `${K & string}Write`]: Result[K]['Write']
}

/** All ModelNames for all DB Names: 'modelName1' | 'modelName2'...  */
export type ModelNames = keyof Result

/** ModelNames for DB { [dbName]: 'modelName1' | 'modelName2'... } */
export type ModelNamesForDb = { [K in keyof AllModelsWithReadWrite]: keyof AllModelsWithReadWrite[K] }
