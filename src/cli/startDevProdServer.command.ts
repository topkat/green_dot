
import { C } from 'topkat-utils'
import { clearCli, cliIntro } from './helpers/cli'
import { autoFindAndInitActiveAppAndDbPaths, getProjectPaths } from '../helpers/getProjectPaths'
import { luigi } from './helpers/luigi.bot'
import { onFileChange } from './fileWatcher'


let watcherOn = true

export async function startDevProdCommand() {

  const { activeApp, appConfigs } = await getProjectPaths()

  if (!activeApp) {
    const folder = await luigi.askSelection(
      'Which server do you want that I start ?',
      appConfigs.map(appConf => appConf.folderPath)
    )

    luigi.confirm()

    autoFindAndInitActiveAppAndDbPaths(folder)

    clearCli()
    cliIntro()
  }

  process.env.SAFE_IMPORT_SILENT = '1'

  process.stdin.setRawMode?.(true)
  process.stdin.resume()
  process.stdin.on('data', userInputKeyHandler)

  luigi.say(`Starting server...
    -> Press ${letter('H')} to toggle hot-reload
    -> Press ${letter('R')} to restart server
    -> Press ${letter('Q')} to quit
`, { noWrap: true })

  const { startServer, stopServer } = await import('green_dot' as any)

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
      C.info(`File change detected for ${path}, restarting...`)
      C.log(`\n\n`)
      await stopServer()
      process.exit(1)
    }
  })
}

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

function userInputConfirmLog(txt: string) {
  C.log(C.logClr(C.bg(0, 255, 0) + ' ' + txt + ' '))
}

function letter(txt: string) {
  return C.bg(200, 200, 200) + C.rgb(0, 0, 0) + ' ' + txt + ' ' + C.reset
}



function userInputKeyHandler(buff) {

  const char = buff.toString()
  const hex = buff.toString('hex')

  if (hex === '03' || hex === '04' || char === 'q') { // Ctrl+C
    userInputConfirmLog('QUIT')
    process.stdin.setRawMode(false)
    process.stdin.pause()
    process.exit(0)
  } else if (hex === '0C') { // Ctrl+L (Clear Screen)
    clearCli()
  } else if (hex === '0B') { // Ctrl+K (Clear Line from Cursor)
    process.stdout.write('\x1b[K') // ANSI escape sequence
  } else if (hex === '7F') { // Backspace
    process.stdout.write('\b \b') // Erase last character
  } else if (hex === '09') {
    process.stdout.write('  ') // Simulate tab spaces
  } else if (hex === '0D') {
    process.stdout.write('\n')// Newline
  } else if (char === 'h') {
    // WATCH MODE TOGGLE
    watcherOn = !watcherOn
    userInputConfirmLog('WATCHER: ' + (watcherOn ? 'ON' : 'OFF'))
  } else if (char === 'r') {
    userInputConfirmLog('RESTARTING SERVER')
    process.exit(202)
  } else {
    process.stdout.write(char)
  }
}