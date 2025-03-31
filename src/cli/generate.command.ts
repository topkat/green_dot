
import Path from 'path'
import fs from 'fs-extra'
import { C, camelCaseify } from 'topkat-utils'
import { luigi } from './helpers/luigi.bot'
import { findProjectPath, getProjectPaths } from '../helpers/getProjectPaths'
import { cliGenerateService } from './generate/cliGenerateService'
import { cliGenerateModel } from './generate/cliGenerateModel'
import { cliGenerateSchedule } from './generate/cliGenerateSchedule'
import { cliGenerateErrorFile } from './generate/cliGenerateErrorFile'
import { cliGenerateTestFlow } from './generate/cliGenerateTestSuite'
import { cliGenerateSeed } from './generate/cliGenerateSeed'
import { initGreenDotConfigs } from '../helpers/getGreenDotConfigs'


export async function generateCommand() {

  const { exists } = await findProjectPath(true)

  C.log('\n\n')

  if (!exists) {

    await generateBlankProject()

  } else {

    try {
      await initGreenDotConfigs()
    } catch (err) { C.error(false, 'Could not get green_dot configs') }

    const { appConfigs, dbConfigs, activeApp, activeDb } = await getProjectPaths()

    const selection = await luigi.askSelection([
      `Hi boss! What should we generate today?`,
      `Blip...bloup...choose an entry to generate:`,
    ], [
      luigi.separator(`-- APP --------------`),
      { value: 'apiSvc', name: 'Api Service', description: 'Generate a new service that will be exposed via API and in the generated SDKs. The service can also be called internally like a classic function' },
      { value: 'schedule', name: 'Scheduled Task', description: 'Generate a service that will run periodically based on a configured cron' },
      { value: 'seed', name: 'Seed Service', description: 'Generate a service that will run on server start' },
      { value: 'errFile', name: 'Error File', description: 'Generate a new Error Definition file, this is where you define all the errors available in the ctx (Eg:ctx.error.myError())' },
      luigi.separator(`-- DATABASE ----------`),
      { value: 'model', name: 'Database Model', description: 'Generate a new database model (Eg: "userModel", "companyModel"...)' },
      luigi.separator(`-- TESTS -------------`),
      { value: 'testSuite', name: 'Test Suite', description: 'Generate an api test suite' },
      luigi.separator(`-- PROJECT -----------`),
      { value: 'db', name: 'New Database', description: 'Generate a new database' },
      { value: 'app', name: 'New Backend App', description: 'Generate a new backend app' },
      { value: 'frontend', name: 'New frontend', description: 'TODO ??' },
    ] as const)

    //  ╔══╗ ╔══╗ ══╦══ ╦  ╦ ╔═══
    //  ╠══╝ ╠══╣   ║   ╠══╣ ╚══╗
    //  ╩    ╩  ╩   ╩   ╩  ╩ ═══╝

    let fileName = await luigi.askUserInput(
      `What would be the best name for your file?\n${C.dim('=> camelCase, without extension. Eg: subscribeToNewsletter')}`
    )

    fileName = camelCaseify(fileName).trim().replace('.svc', '').replace('.ts', '')

    const isSvc = selection === 'apiSvc' || selection === 'schedule' || selection === 'errFile' || selection === 'seed'

    let baseFolder: string
    let additionalFolderPath = ''
    let hasSrc = false

    if (isSvc || selection === 'testSuite') {

      baseFolder = activeApp?.folderPath || (appConfigs.length === 1 ? appConfigs[0].folderPath : await luigi.askSelection(
        `In which app ?`,
        appConfigs.map(c => ({ name: c.folderPathRelative, value: c.folderPath }))
      ))

    } else if (selection === 'model') {

      baseFolder = activeDb?.folderPath || (dbConfigs.length === 1 ? dbConfigs[0].folderPath : await luigi.askSelection(
        `In which DB folder ?`,
        dbConfigs.map(c => ({ name: c.folderPathRelative, value: c.folderPath }))
      ))
    }

    hasSrc = await fs.exists(Path.join(baseFolder, 'src'))
    if (hasSrc) baseFolder = Path.join(baseFolder, 'src')

    if (isSvc || selection === 'testSuite') {
      additionalFolderPath = await luigi.autoComplete(
        `In which folder to generate that file ?\n${C.dim('=> begin by typing to search or create a new folder')}`,
        async input => {
          const allFolders = await getFolders(baseFolder)
          let choices = allFolders.filter(f => !f.name.startsWith('.') && !f.name.includes('_generated'))
          if (input) {
            if (!choices.some(c => c.name === input)) choices.push({ name: C.dim('Create: ') + input, value: input })
            choices = choices.filter(f => f.name.includes(input))
          }
          choices.push({ name: './', value: baseFolder })
          return choices
        }
      )
    }

    const filePathWithoutExt = Path.join(baseFolder, additionalFolderPath, fileName)

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
      } else if (selection === 'seed') {
        await cliGenerateSeed(fileName, filePathWithoutExt + '.seed.ts')
      } else throw 'no service type ' + selection + ' configured'

    } else if (selection === 'model') {

      //  ╦╗╔╦ ╔══╗ ╔═╗  ╔══╗ ╦
      //  ║╚╝║ ║  ║ ║  ║ ╠═   ║
      //  ╩  ╩ ╚══╝ ╚══╝ ╚══╝ ╚══╝

      await cliGenerateModel(fileName, filePathWithoutExt)

    } else if (selection === 'testSuite') {

      //  ══╦══ ╔══╗ ╔═══ ══╦══   ╔══╗ ╦    ╔══╗ ╦  ╦
      //    ║   ╠═   ╚══╗   ║     ╠═   ║    ║  ║ ║╔╗║
      //    ╩   ╚══╝ ═══╝   ╩     ╩    ╚══╝ ╚══╝ ╩╝╚╩

      await cliGenerateTestFlow(fileName, filePathWithoutExt)

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







    // await templater(
    //   Path.resolve(__dirname, './templates'),
    //   'TODO',
    //   [
    //     // ESM => COMMON JS

    //     // Import default
    //     [/import ([^\s]*) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
    //     // Import named
    //     [/import {([^}]+)} from ['"]([^'"]+)['"]/g, 'const {$1} = require(\'$2\')'],
    //     // Import all
    //     [/import \* as ([^\s]+) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
    //     // Export default
    //     [/export default ([^\s]+)/g, 'module.exports = $1'],
    //     // Export named
    //     [/export (?:const|let|var|function) ([^\s(]+) ?=?/g, 'exports.$1 ='],

    //     [/export \{/, 'module.exports = {'],
    //     // extensions in imports (avoid targetting package.json "exports")
    //     [/(import .*)\.mjs/g, `$1.cjs`],
    //     [/(require.*)\.mjs/g, `$1.cjs`],
    //   ],
    //   [
    //     ['.template', ''],
    //     ['.mjs', '.cjs'],
    //   ],
    //   [/\.ts$/]
    // )


  }
}


async function generateBlankProject() {

  const projectName = await luigi.askUserInput(`Greetings, carbon-based entity! What is the name of the project you want to create:`)

  // TODO
  C.log(`pro`, projectName)

}


async function getFolders(basePath: string): Promise<{ name: string, value: string }[]> {
  const entries = await fs.readdir(basePath, { withFileTypes: true })
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => ({ name: entry.name, value: Path.resolve(basePath, entry.name) }))
}