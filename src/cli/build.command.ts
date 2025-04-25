

import { generateDbCachedFiles } from './build/generateDbCachedFiles'
import { initGreenDotConfigs, getMainConfig } from '../helpers/getGreenDotConfigs'
import { createNewTask } from './helpers/createNewTask'
import { generateIndexForProjectDb } from './build/generateIndexForProjectDb'
import { generateIndexForProjectApp } from './build/generateIndexForProjectApp'
import { C } from 'topkat-utils'
import { getServerConfigFromEnv } from './helpers/cli'
import { generateSdk } from '../generate/generateSDK/generateSDK'
import { generateMainBackendFiles } from '../generate/generateMainBackendFiles'
import { initProjectAndDaosCache } from '../helpers/getProjectModelsAndDaos'
import { autoIndex } from '../services/autoIndex'
import { getProjectPaths } from '../helpers/getProjectPaths'

const env = getServerConfigFromEnv()

export async function buildCommand() {

  process.env.SAFE_IMPORT_VERBOSE = '1'

  const build = createNewTask()

  // From here we build indexes and we don't require to execute project code

  await build.step(`Generating indexes for databases`, generateIndexForProjectDb)

  await build.step(`Generating indexes for applications`, generateIndexForProjectApp)

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

  if (env.env !== 'prod') {
    await build.step(`Generating types for databases`, generateDbCachedFiles, { watch: true, cleanOnError: true })
  }

  await build.step(`Generating SDKs`, async () => {
    await initProjectAndDaosCache()
    C.success(`Successfully initialized Dao and Models`)
    await generateMainBackendFiles()
    C.success(`Successfully generated backend output files`)
    await generateSdk(false)
  })

  C.log('\n\n' + C.dim('='.repeat(50) + '\n'))

  build.end(`Successfully built green_dot project`)

  process.env.SAFE_IMPORT_VERBOSE = '0'

}