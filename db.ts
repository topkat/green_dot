import 'typescript-generic-types'

export { db } from './src/db'

import { AllModels } from './src/cache/dbs/index.generated'

type Result = MergeMultipleObjects<AllModels>


/** With this getter you can safely use your model types anywhere (even in db folders).
If you use straight type like ```User```, it may error when you are in a database folder
for example
  * * Usage: ```type User = ModelTypes['user']``` */
export type ModelTypes = {
  [K in keyof Result]: Result[K]['Read']
}