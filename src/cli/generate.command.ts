

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
      sdkRoot,
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


async function generateService(fileName: string) {

  const { allRoles, generateCommandOptions } = await getMainConfig()
  const { apiServiceDefaultOptions } = generateCommandOptions || {}

  const roles = await luigi.askSelection(
    `Who is allowed to access this route?`,
    [
      { name: 'Public (the route is available without connexion)', value: 'public' },
      ...allRoles.map(r => ({ name: capitalize1st(r), value: r }))
    ] as const,
    { multi: true }
  )

  const selection = await luigi.askSelection([
    `Let's go ?`
  ], [
    `OK`,
    `Advanced options`,
  ])

  let { displayApiMethodField, displayApiRouteField, docStyle, rateLimiter } = apiServiceDefaultOptions || {}

  if (selection === 'Advanced options') {

    luigi.tips(`In your green_dot.config.ts file, you can configure \`{ generateCommandOptions }\` to set the default values of a generated file`)

    docStyle = await luigi.askSelection(
      `What style of doc do you want to write for your service ?\n${C.dim('Doc are used to display info on hover in the SDK, generate Swagger doc...etc')}`,
      [
        { value: 'none' satisfies typeof docStyle, description: 'Only weaks need docs' },
        { value: 'simple' satisfies typeof docStyle, description: 'A simple line exmplaining your service' },
        { value: 'extended' satisfies typeof docStyle, description: 'An extended documentation with errors documented' },
      ] as const,
      { default: docStyle }
    )

    rateLimiter = await luigi.askSelection(
      `Do you want to set a rate limiter?\n${C.dim('Rate limiter is an important security feature that allow only a reasonable number of apiCalls in a given time window')}`,
      ['disable', '5/30s', '10/30s', '30/30s'] satisfies RateLimiterStr[]
    )

  }

  const file = `
import { svc, db, _ } from 'green_dot'


export const ${fileName} = svc({
    for: [${roles.length ? `'${roles.join(`', '`)}'` : ''}],
    doc: \`Write your service doc here\`,
    input: {
      exempleField: _.string()
    },
    output: _.undefined(),
    rateLimiter: '5/min',
    async main(ctx, {
        exempleField,
    }) {
        
    },
})

`
}