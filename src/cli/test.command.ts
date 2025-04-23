
import { C } from 'topkat-utils'
import { clearCli, cliBadge, cliIntro, getServerConfigFromEnv, userInputConfirmLog, userInputKeyHandler } from './helpers/cli'
import { autoFindAndInitActiveAppAndDbPaths, getProjectPaths } from '../helpers/getProjectPaths'
import { luigi } from './helpers/luigi.bot'
import { onFileChange } from './fileWatcher'
import { intro as testCliIntro } from '../restTest/rest-test-ascii-display'
import { GreenDotApiTestsConfig } from '../restTest/rest-test-types'


let watcherOn = true

const cliVars = getServerConfigFromEnv<{ filter: string }>()

export async function testCommand() {

  const { appConfigs } = await getProjectPaths()

  const testConfigs = appConfigs.map(apconf => apconf.testConfigPath).filter(e => e)
  const testConfigPath = await findTestConfig(testConfigs)

  handleUserInputInCli()

  const testConfig = await import(testConfigPath) as GreenDotApiTestsConfig


  const startAtTestNb = /^\d+$/.test(startAtTestNbStr) ? parseInt(startAtTestNbStr) : 0
  const isReload = startAtTestNb > 0

  let restTestState = {}
  if (isReload) {
    // eslint-disable-next-line no-console
    console.log(testCliIntro) // do not use C.log
    restTestState = await retrieveEnvFromFile()
  }

  const testFlowPath2 = path.resolve(process.cwd(), testFlowPath)
  const configPath2 = path.resolve(process.cwd(), configPath)

  const restTest = await import('./index.js')
  const scenario = await import(testFlowPath2)
  const restTestConfig = await import(configPath2)

  await restTest.testRunner.runScenario(scenario.default as any, {
    ...restTestConfig.restTestConfig,
    onError: onErrorCli,
    startAtTestNb,
    env: { ...restTestConfig.restTestConfig.env, ...getEnvAtTest(startAtTestNb) },
    afterTest,
    displayIntroTimeout: startAtTestNb > 0 ? 0 : restTestConfig.restTestConfig.displayIntroTimeout,
    filter,
    isReload,
    restTestState,
  })




























  const errorHandler = async err => {
    C.error(err)
    await stopServer()
    if (watcherOn === false) userInputKeyHandler('h')
    // Don't put spinner here
    process.exit(201) // hot reload
  }

  // Catch All App Errors, even the unhandled ones
  process.on('unhandledRejection', errorHandler)
  process.on('uncaughtException', errorHandler)

  try {
    // Here it's important that we load the npm module to avoid
    // creating multiple context of execution. Actually we'll
    // use the same green_dot module that the app use and not
    // a local version

    await startServer()

  } catch (err) {
    errorHandler(err)
  }

  // HOT RELOAD
  await onFileChange(async path => {
    if (path.includes('generated')) return
    if (watcherOn) {
      C.info(`File change detected for ${path}, restarting (hr)...`)
      C.log(`\n\n`)
      await stopServer()
      process.exit(202)
    }
  })
}





















async function onErrorCli(actualTestNb: number, restTestState: Record<string, any> = {}) {
  await saveEnvToFile(restTestState)

  // eslint-disable-next-line no-console
  console.log(`%%${actualTestNb}%%`) // send test number so that parent process can interpolate it

  process.exit(0)
}


async function afterTest(actualTestNb: number, env: Record<string, any>) {
  const previousEnv = getEnvAtTest(actualTestNb - 1)
  const allKeys = noDuplicateFilter([...Object.keys(previousEnv), ...Object.keys(env)])
  const actualEnv = JSONstringyParse(env)

  for (const k of allKeys) {
    if (JSON.stringify(actualEnv[k]) === JSON.stringify(previousEnv[k])) delete actualEnv[k]
    else if (typeof actualEnv[k] === 'undefined' && previousEnv[k]) actualEnv[k] = undefined // should override
  }

  envCache[actualTestNb] = actualEnv
}

function getEnvAtTest(testNb: number) {
  return Object.assign({}, ...envCache.slice(0, testNb + 1))
}

async function saveEnvToFile(restTestState: Record<string, any> = {}) {
  await fs.writeFile('./.testenv', removeCircularJSONstringify({
    env: envCache,
    restTestState,
  }))
}

async function retrieveEnvFromFile() {
  const fileAsStr = await fs.readFile('./.testenv', 'utf-8')
  const saveObj = (fileAsStr ? JSON.parse(fileAsStr) : { env: [], restTestState: {} }) as RestTestSave
  envCache = saveObj.env
  return saveObj.restTestState
}

type RestTestSave = { env: any[], restTestState: Record<string, any> }









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


async function findTestConfig(testConfigs: string[]) {

  if (!testConfigs.length) {
    throw new Error('No test config found for any projects, please make sure you have green_dot.apiTests.config.ts file on your project')
  } else if (testConfigs.length > 1) {
    const testConfigPath = await luigi.askSelection(
      'Which app should I test ?',
      testConfigs
    )

    luigi.confirm()

    clearCli()
    cliIntro()

    return testConfigPath
  } else {
    return testConfigs[0]
  }
}