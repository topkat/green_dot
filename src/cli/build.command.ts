

import { generateDbCachedFiles } from './build/generateDbCachedFiles'
import { initGreenDotConfigs } from '../helpers/getGreenDotConfigs'
import { createNewTask } from './createNewTask'
import { generateIndexForProjectDb } from './build/generateIndexForProjectDb'
import { generateIndexForProjectApp } from './build/generateIndexForProjectApp'
import { C } from 'topkat-utils'
import { getServerConfigFromEnv } from './helpers/cli'
import { generateSdk } from '../generate/generateSDK/generateSDK'

const env = getServerConfigFromEnv()

export async function buildCommand() {

  process.env.SAFE_IMPORT_VERBOSE = '1'

  const build = createNewTask()

  await build.step(`Generating SDKs defaults`, () => generateSdk(true))
  // From here we build indexes and we don't require to execute project code

  await build.step(`Generating indexes for databases`, generateIndexForProjectDb)

  await build.step(`Generating indexes for applications`, generateIndexForProjectApp)

  // From Here, we execute some project code so it may break more easily


  await build.step(`Getting green_dot configs`, async () => await initGreenDotConfigs(false), { watch: true, cleanOnError: true })

  if (env.env !== 'prod') {
    await build.step(`Generating types for databases`, generateDbCachedFiles, { watch: true, cleanOnError: true })
  }

  await build.step(`Generating SDKs`, () => generateSdk(false))

  C.log('\n\n' + C.dim('='.repeat(50) + '\n'))

  build.end(`Successfully built green_dot project`)

  process.env.SAFE_IMPORT_VERBOSE = '0'

}