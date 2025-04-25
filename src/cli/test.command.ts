
import { C, JSONstringyParse, noDuplicateFilter, removeCircularJSONstringify } from 'topkat-utils'
import { clearCli, cliBadge, cliIntro, getServerConfigFromEnv, userInputConfirmLog, userInputKeyHandler } from './helpers/cli'
import { getProjectPaths, greenDotCacheModuleFolder } from '../helpers/getProjectPaths'
import { luigi } from './helpers/luigi.bot'
import { onFileChange } from './helpers/fileWatcher'
import { intro as testCliIntro } from '../restTest/rest-test-ascii-display'
import { GreenDotApiTestsConfig, TestSuite } from '../restTest/rest-test-types'
import fs from 'fs-extra'
import Path from 'path'
import { testRunner } from '../restTest/rest-test-runner'
import { GreenDotConfig } from '../types/mainConfig.types'


let watcherOn = false
let envCache: any[] = []
let restTestState = {}
let startAtTestNb = 0

const { filter, isReload, ci = false } = getServerConfigFromEnv<{ filter?: string, ci?: boolean }>()

export async function testCommand() {

  const { testConfig, allTests } = await findTestPaths()

  handleUserInputInCli()

  C.log(testCliIntro)

  if (isReload) {
    const { restTestState: rts, env, startAtTestNb: tn } = await retrieveEnvFromFile()
    envCache = env
    startAtTestNb = tn
    restTestState = rts
  }

  watcherOn = false

  // Catch All App Errors, even the unhandled ones
  process.on('unhandledRejection', errorHandler)
  process.on('uncaughtException', errorHandler)

  try {

    await testRunner.runScenario(allTests, {
      ...testConfig,
      onError: async (actualTestNb, rsState) => {
        startAtTestNb = actualTestNb
        restTestState = rsState
        await saveEnvToFile()
      },
      startAtTestNb,
      env: { ...testConfig.env, ...getEnvAtTest(startAtTestNb) },
      afterTest,
      displayIntroTimeout: startAtTestNb > 0 ? 0 : testConfig.displayIntroTimeout,
      filter,
      isReload,
      restTestState,
    })

  } catch (err) {
    errorHandler(err)
  }

  // HOT RELOAD
  await onFileChange(async path => {
    if (path.includes('generated')) return
    if (watcherOn) {
      C.info(`File change detected for ${path}, restarting (hr)...`)
      C.log(`\n\n`)
      process.exit(202)
    }
  })
}







async function errorHandler(err) {
  C.error(err)

  if (ci) process.exit(1)
  else {
    watcherOn = true

    const choice = await luigi.askSelection(
      `Hey, it seems everything didn't happens as expected...\n * Tips: save a file to trigger hot reload and restart tests\n * press ${cliBadge('W')} to disable watcher\n\nWhat should we do next?`,
      ['Replay last', 'Ignore', 'Replay all', 'Exit'] as const
    )

    if (choice === 'Exit') process.exit(0)
    else if (choice === 'Replay all') {
      startAtTestNb = 0
    } else if (choice === 'Ignore') {
      startAtTestNb += 1
    }

    await saveEnvToFile()

    process.exit(201) // simple reload
  }
}















async function afterTest(actualTestNb: number, env: Record<string, any>) {
  const previousEnv = getEnvAtTest(actualTestNb - 1)
  const allEnvKeys = noDuplicateFilter([...Object.keys(previousEnv), ...Object.keys(env)])
  const actualEnv = JSONstringyParse(env)

  for (const k of allEnvKeys) {
    if (JSON.stringify(actualEnv[k]) === JSON.stringify(previousEnv[k])) delete actualEnv[k]
    else if (typeof actualEnv[k] === 'undefined' && previousEnv[k]) actualEnv[k] = undefined // should override
  }

  envCache[actualTestNb] = actualEnv
}

function getEnvAtTest(testNb: number) {
  return Object.assign({}, ...envCache.slice(0, testNb + 1))
}














//  ╔══╗ ╦╗ ╔ ╦  ╦   ╔══╗ ═╦═ ╦    ╔══╗
//  ╠═   ║╚╗║ ╚╗ ║   ╠═    ║  ║    ╠═
//  ╚══╝ ╩ ╚╩  ╚═╝   ╩    ═╩═ ╚══╝ ╚══╝

type RestTestSave = {
  env: any[]
  restTestState: Record<string, any>
  startAtTestNb?: number
}

const testEnvFilePath = Path.join(greenDotCacheModuleFolder, '/.testenv')

async function saveEnvToFile() {
  console.log(`CHECK IF SAVED TWICE ON ERR`)
  await fs.outputFile(testEnvFilePath, removeCircularJSONstringify({
    env: envCache,
    restTestState,
    startAtTestNb,
  } satisfies RestTestSave))
}

async function retrieveEnvFromFile() {
  const fileAsStr = await fs.readFile(testEnvFilePath, 'utf-8')
  const saveObj = (fileAsStr ? JSON.parse(fileAsStr) : { env: [], restTestState: {} }) as RestTestSave
  return saveObj
}



//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

function handleUserInputInCli() {

  process.stdin.setRawMode?.(true) // TODO do we need that
  process.stdin.resume() // AND THAT
  process.stdin.on('data', buff => userInputKeyHandler(buff, {
    customKeyHandler(char) {
      if (char === 'h') {
        // WATCH MODE TOGGLE
        watcherOn = !watcherOn
        userInputConfirmLog('WATCHER: ' + (watcherOn ? 'ON' : 'OFF'))
      } else if (char === 'r') {
        userInputConfirmLog('RESTARTING TESTS')
        process.exit(202)
      } else return { wasHandled: false }
      return { wasHandled: true }
    }
  }))

  luigi.say(`Starting tests...
    -> Press ${cliBadge('H')} to toggle hot-reload
    -> Press ${cliBadge('R')} to restart server
    -> Press ${cliBadge('Q')} to quit
`, { noWrap: true })
}


async function findTestPaths() {

  const { appConfigs, mainConfig } = await getProjectPaths()

  const testConfigs = appConfigs.map(apconf => apconf.testConfigPath).filter(e => e)

  let testConfigPath = testConfigs[0]

  if (!testConfigs.length) {
    throw new Error('No test config found for any projects, please make sure you have green_dot.apiTests.config.ts file on your project')
  } else if (testConfigs.length > 1) {
    testConfigPath = await luigi.askSelection(
      'Which app should I test ?',
      appConfigs.map(apconf => apconf.testConfigPath).filter(e => e)
    )

    luigi.confirm()

    clearCli()
    cliIntro()
  }

  const testIndexPath = appConfigs.find(appConf => appConf.testConfigPath === testConfigPath).testIndexPath

  const mainConfig2 = await import(mainConfig.path) as GreenDotConfig // IMPORT GLOBAL TYPES

  const testConfig = await import(testConfigPath) as GreenDotApiTestsConfig

  const tests = await import(testIndexPath) as { allTests: { [fileName: string]: TestSuite } }

  return { testConfig, allTests: tests.allTests, mainConfig: mainConfig2 }
}