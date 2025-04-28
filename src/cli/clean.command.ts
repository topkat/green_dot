

import fs from 'fs-extra'
import { C } from 'topkat-utils'
import { createNewTask } from './helpers/createNewTask'
import { generateIndexForDbTypeFiles } from './build/generateIndexForDbTypeFiles'
import { greenDotCacheModuleFolder } from '../helpers/getProjectPaths'


export async function cleanCommand() {

  const build = createNewTask()

  C.info('Cleaning Files')

  await build.step(
    `Deleting cache folder`,
    async () => await fs.rm(greenDotCacheModuleFolder, { recursive: true, force: true }),
    { cleanOnError: false, doNotDisplayTime: true }
  )

  await build.step(
    `Regenerating default DB indexes`,
    generateIndexForDbTypeFiles,
    { cleanOnError: false, doNotDisplayTime: true }
  )

  C.log(C.dim('='.repeat(50) + '\n'))

  build.end(`Successfully cleaned files`)

}