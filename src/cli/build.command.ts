import { generateFilesForCachedDb } from './build/generateFilesForCachedDb'
import { initGreenDotConfigs, getMainConfig } from '../helpers/getGreenDotConfigs'
import { createNewTask } from './helpers/createNewTask'
import { generateIndexForProjectDb } from './build/generateIndexForProjectDb'
import { generateIndexForProjectApp } from './build/generateIndexForProjectApp'
import { C } from 'topkat-utils'
import { generateSdk } from '../generate/generateSDK/generateSDK'
import { initProjectAndDaosCache } from '../helpers/getProjectModelsAndDaos'
import { autoIndex } from '../services/autoIndex'
import { getProjectPaths } from '../helpers/getProjectPaths'
import { generateIndexForDbTypeFiles } from './build/generateIndexForDbTypeFiles'



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