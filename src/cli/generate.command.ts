

import Path from 'path'
import fs from 'fs-extra'
import { C, camelCaseify, capitalize1st } from 'topkat-utils'
import { createNewTask } from './createNewTask'
import { generateIndexForDbCachedFiles } from './build/generateIndexForDbCachedFiles'
import { luigi } from './helpers/luigi.bot'
import { findProjectPath, getProjectPaths } from '../helpers/getProjectPaths'
import { templater } from 'simple-file-templater'
import { getMainConfig } from '../helpers/getGreenDotConfigs'
import { RateLimiterStr } from '../security/serviceRouteRateLimiter'
import { cliGenerateService } from './generate/cliGenerateService'
import { cliGenerateModel } from './generate/cliGenerateModel'
import { cliGenerateSchedule } from './generate/cliGenerateSchedule'
import { cliGenerateErrorFile } from './generate/cliGenerateErrorFile'


export async function generateCommand() {

  const { exists, cwd } = await findProjectPath(true)

  if (!exists) {

    await generateBlankProject()

  } else {


    const { appConfigs, dbConfigs, activeApp, activeDb } = await getProjectPaths()

    const selection = await luigi.askSelection([
      `Hi boss! What should we generate today?`,
      `Blip...bloup...choose an entry to generate:`,
    ], [
      { value: 'apiSvc', name: 'Api Service', description: 'Generate a new api service' },
      { value: 'model', name: 'Model', description: 'Generate a new database model' },
      { value: 'schedule', name: 'Scheduled Task', description: 'Generate a service that will run periodically based on a configured cron' },
      { value: 'testFlow', name: 'Test Flow', description: 'Generate an api test suite' },
      { value: 'errFile', name: 'Error File', description: 'Generate a new Error Definition file, this is where you define all the errors that will be available with ctx.error.myError()' },
      { value: 'db', name: 'New Database', description: 'Generate a new database' },
      { value: 'app', name: 'New backend', description: 'Generate a new backend' },
      { value: 'frontend', name: 'New frontend', description: 'DOIU ZOIU OIDU ZDOIUZ ADOI' },
    ] as const)

    //  ╔══╗ ╔══╗ ══╦══ ╦  ╦ ╔═══
    //  ╠══╝ ╠══╣   ║   ╠══╣ ╚══╗
    //  ╩    ╩  ╩   ╩   ╩  ╩ ═══╝

    let fileName = await luigi.askUserInput(
      `What would be the best name for your file?\n${C.dim('=> camelCase, without extension. Eg: subscribeToNewsletter')}`
    )

    fileName = camelCaseify(fileName).trim().replace('.svc', '').replace('.ts', '')

    const isSvc = selection === 'apiSvc' || selection === 'schedule' || selection === 'errFile'

    let baseFolder: string
    let additionalFolderPath = ''

    if (isSvc || selection === 'testFlow') {

      baseFolder = activeApp?.folderPath || (appConfigs.length === 1 ? appConfigs[0].folderPath : await luigi.askSelection(
        `In which app ?`,
        appConfigs.map(c => ({ name: c.folderPathRelative, value: c.folderPath }))
      ))

      additionalFolderPath = await luigi.autoComplete(
        `In which folder to generate that file ?`,
        async input => {
          const allFolders = await getFolders(baseFolder)
          const choices = allFolders.filter(f => f.name.includes(input))
          if (input) choices.push({ name: C.dim('Create: ') + input, value: input })
          choices.push({ name: './', value: baseFolder })
          return choices
        }
      )

    } else if (selection === 'model') {

      baseFolder = activeDb?.folderPath || (dbConfigs.length === 1 ? dbConfigs[0].folderPath : await luigi.askSelection(
        `In which DB folder ?`,
        dbConfigs.map(c => ({ name: c.folderPathRelative, value: c.folderPath }))
      ))
    }

    const hasSrc = await fs.exists(Path.join(baseFolder, 'src'))

    const filePathWithoutExt = Path.join(baseFolder, hasSrc ? 'src' : undefined, additionalFolderPath, fileName)

    if (isSvc) {

      //  ╔═══ ╔══╗ ╔══╗ ╦  ╦ ═╦═ ╔══╗ ╔══╗
      //  ╚══╗ ╠═   ╠═╦╝ ╚╗ ║  ║  ║    ╠═
      //  ═══╝ ╚══╝ ╩ ╚   ╚═╝ ═╩═ ╚══╝ ╚══╝

      if (selection === 'apiSvc') {
        await cliGenerateService(fileName, filePathWithoutExt + '.svc.ts')
      } else if (selection === 'errFile') {
        await cliGenerateErrorFile(filePathWithoutExt + '.error.ts')
      } else if (selection === 'schedule') {
        await cliGenerateSchedule(fileName, filePathWithoutExt + '.schedule.ts')
      } else throw 'no service type ' + selection + ' configured'

    } else if (selection === 'model') {

      //  ╦╗╔╦ ╔══╗ ╔═╗  ╔══╗ ╦
      //  ║╚╝║ ║  ║ ║  ║ ╠═   ║
      //  ╩  ╩ ╚══╝ ╚══╝ ╚══╝ ╚══╝

      await cliGenerateModel(fileName, filePathWithoutExt)

    } else if (selection === 'testFlow') {

      //  ══╦══ ╔══╗ ╔═══ ══╦══   ╔══╗ ╦    ╔══╗ ╦  ╦
      //    ║   ╠═   ╚══╗   ║     ╠═   ║    ║  ║ ║╔╗║
      //    ╩   ╚══╝ ═══╝   ╩     ╩    ╚══╝ ╚══╝ ╩╝╚╩

    } else if (selection === 'app') {

      //  ╔══╗ ╔══╗ ╔══╗
      //  ╠══╣ ╠══╝ ╠══╝
      //  ╩  ╩ ╩    ╩

    } else if (selection === 'db') {

      //  ╔═╗  ╔═╗
      //  ║  ║ ╠═╩╗
      //  ╚══╝ ╚══╝

    } else if (selection === 'frontend') {

      //  ╔══╗ ╔══╗ ╔══╗ ╦╗ ╔ ══╦══
      //  ╠═   ╠═╦╝ ║  ║ ║╚╗║   ║
      //  ╩    ╩ ╚  ╚══╝ ╩ ╚╩   ╩

    } else throw C.error(false, 'Not implemented method ' + selection)







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


async function getFolders(basePath: string): Promise<{ name: string, value: string }[]> {
  const entries = await fs.readdir(basePath, { withFileTypes: true })
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => ({ name: entry.name, value: Path.resolve(basePath, entry.name) }))
}