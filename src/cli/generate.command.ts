

import Path from 'path'
import fs from 'fs-extra'
import { C, camelCaseify, capitalize1st } from 'topkat-utils'
import { createNewTask } from './createNewTask'
import { generateIndexForDbCachedFiles } from './build/generateIndexForDbCachedFiles'
import { luigi } from './helpers/luigi.bot'
import { findProjectPath } from '../helpers/getProjectPaths'
import { templater } from 'simple-file-templater'
import { getMainConfig } from '../helpers/getGreenDotConfigs'
import { RateLimiterStr } from '../security/serviceRouteRateLimiter'
import { generateService } from './generate/cliGenerateService'


export async function generateCommand() {

  const { exists } = await findProjectPath(true)

  if (!exists) {
    await generateBlankProject()
  } else {

    const selection = await luigi.askSelection([
      `Hi Cap'tain! What should we generate today?`,
      `Blip...bloup...choose entry to generate:`,
    ], [
      { value: 'Api Service', description: 'DOIU ZOIU OIDU ZDOIUZ ADOI' },
      { value: 'Model', description: 'DOIU ZOIU OIDU ZDOIUZ ADOI' },
      { value: 'Scheduled Task', description: 'DOIU ZOIU OIDU ZDOIUZ ADOI' },
      { value: 'Test Flow', description: 'DOIU ZOIU OIDU ZDOIUZ ADOI' },
      { value: 'Error File', description: 'DOIU ZOIU OIDU ZDOIUZ ADOI' },
      { value: 'Database', description: 'DOIU ZOIU OIDU ZDOIUZ ADOI' },
      { value: 'App', description: 'DOIU ZOIU OIDU ZDOIUZ ADOI' },
    ] as const)

    let fileName = await luigi.askUserInput(
      `What would be the best name for your file?`
    )

    fileName = camelCaseify(fileName)

    if (selection === 'Api Service') {
      await generateService(fileName)
    }





    await templater(
      Path.resolve(__dirname, './templates'),
      'TODO',
      [
        // ESM => COMMON JS

        // Import default
        [/import ([^\s]*) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
        // Import named
        [/import {([^}]+)} from ['"]([^'"]+)['"]/g, 'const {$1} = require(\'$2\')'],
        // Import all
        [/import \* as ([^\s]+) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
        // Export default
        [/export default ([^\s]+)/g, 'module.exports = $1'],
        // Export named
        [/export (?:const|let|var|function) ([^\s(]+) ?=?/g, 'exports.$1 ='],

        [/export \{/, 'module.exports = {'],
        // extensions in imports (avoid targetting package.json "exports")
        [/(import .*)\.mjs/g, `$1.cjs`],
        [/(require.*)\.mjs/g, `$1.cjs`],
      ],
      [
        ['.template', ''],
        ['.mjs', '.cjs'],
      ],
      [/\.ts$/]
    )


  }
}


async function generateBlankProject() {

  const projectName = await luigi.askUserInput(`Greetings, carbon-based entity! What is the name of the project you want to create:`)

  // TODO
  console.log(`pro`, projectName)

}


