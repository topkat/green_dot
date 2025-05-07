console.log('IMP1xx')
import { generateFilesForCachedDb } from './build/generateFilesForCachedDb'
console.log('IMP2xx')
import { initGreenDotConfigs, getMainConfig } from '../helpers/getGreenDotConfigs'
console.log('IMP3xx')
import { createNewTask } from './helpers/createNewTask'
console.log('IMP4xx')
import { generateIndexForProjectDb } from './build/generateIndexForProjectDb'
console.log('IMP5xx')
import { generateIndexForProjectApp } from './build/generateIndexForProjectApp'
console.log('IMP6xx')
import { C } from 'topkat-utils'
console.log('IMP7xx')
import { generateSdk } from '../generate/generateSDK/generateSDK'
console.log('IMP8xx')
import { initProjectAndDaosCache } from '../helpers/getProjectModelsAndDaos'
console.log('IMP9xx')
import { autoIndex } from '../services/autoIndex'
console.log('IMP10xx')
import { getProjectPaths } from '../helpers/getProjectPaths'
console.log('IMP11xx')
import { generateIndexForDbTypeFiles } from './build/generateIndexForDbTypeFiles'
console.log('IMP12xx')



export async function buildCommand({ publishSdks = false } = {}) {
  process.env.SAFE_IMPORT_VERBOSE = '1'

  const build = createNewTask()

  // From here we build indexes and we don't require to execute project code
  await build.step(`Generating indexes for Databases and Applications`, async () => {
    await Promise.all([
      generateIndexForProjectDb(),
      generateIndexForProjectApp()
    ])
  })

  // From Here, we execute some project code so it may break more easily
  await build.step(`Getting green_dot configs`, async () => await initGreenDotConfigs(false), { watch: true, cleanOnError: true })

  const mainConfig = getMainConfig()
  const { mainConfig: mainConfigPath } = await getProjectPaths()

  if (mainConfig?.autoIndexes?.length > 0) {
    await build.step(`Generating index files for client`, async () => {
      await autoIndex(
        mainConfig.autoIndexes,
        mainConfigPath.folderPath
      )
    })
  }

  await build.step(`Generating SDKs defaults`, () => generateSdk(true))

  await build.step(`Generating types for databases`, async () => {
    const indexFile = await generateFilesForCachedDb()
    await generateIndexForDbTypeFiles({ indexFile })
  }, { watch: true, cleanOnError: true })

  await build.step(`Generating SDKs`, async () => {
    await initProjectAndDaosCache()
    C.success(`Successfully initialized Dao and Models`)
    await generateSdk(false, publishSdks)
  })

  C.log('\n\n' + C.dim('='.repeat(50) + '\n'))

  build.end(`Successfully built green_dot project`)

  process.env.SAFE_IMPORT_VERBOSE = '0'
}