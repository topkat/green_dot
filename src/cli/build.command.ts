

import { generateDbCachedFiles } from './build/generateDbCachedFiles'
import { initGreenDotConfigs } from '../helpers/getGreenDotConfigs'
import { createNewTask } from './createNewTask'
import { generateIndexForProjectDb } from './build/generateIndexForProjectDb'
import { generateIndexForProjectApp } from './build/generateIndexForProjectApp'


export async function buildCommand() {

  const build = createNewTask()

  // From here we build index and we don'd require to execute project code

  await build.step(`Generating indexes for databases`, generateIndexForProjectDb)

  await build.step(`Generating indexes for applications`, generateIndexForProjectApp)

  // From Here, we execute some project app so it may be more sensitive

  await build.step(`Initiating cache`, () => initGreenDotConfigs({}))

  await build.step(`Generating types for databases`, generateDbCachedFiles)

  build.end(`Successfully built green_dot project`)

}
