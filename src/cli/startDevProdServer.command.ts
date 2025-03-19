
import { C } from 'topkat-utils'
import { clearCli, cliIntro } from './helpers/cli'
import { autoFindAndInitActiveAppAndDbPaths, getProjectPaths } from '../helpers/getProjectPaths'
import { luigi } from './helpers/luigi.bot'
import { onFileChange } from './fileWatcher'
import { startServer, stopServer } from '../startServer'
import { init as initLocal } from '../init'

let watcherOn = true
// const env = getServerConfigFromEnv()

export async function startDevProdCommand() {

  const { activeApp, appConfigs } = await getProjectPaths()

  if (!activeApp) {
    const folder = await luigi.askSelection({
      message: 'Which server do you want that I start ?',
      choices: appConfigs.map(appConf => appConf.folderPath)
    })

    luigi.confirm()

    autoFindAndInitActiveAppAndDbPaths(folder)
  }

  process.env.SAFE_IMPORT_SILENT = '1'

  clearCli()
  cliIntro()

  process.stdin.setRawMode?.(true)
  process.stdin.resume()
  process.stdin.on('data', userInputKeyHandler)

  luigi.say(`Starting server...\n
      -> Press "w" to toggle file watch and restart mode
      -> Press "r" to restart server manually
      -> Press "q" to quit
`)


  try {

    // TODO FIXME Here there is a context problem as 'green_dot' and '../someLocalFile' do not belong to the same context
    // So this is the workaround
    const { init: initModule } = await import('green_dot' as any)

    await initModule()
    await initLocal()

    await startServer()

  } catch (err) {
    C.error(err)
    if (watcherOn === false) userInputKeyHandler('w')
    // Don't put spinner here
    C.warning(false, 'Waiting for file change')
  }


  await onFileChange(async path => {
    if (path.includes('generated')) return
    C.info(`File change detected for ${path}, restarting...`)
    if (watcherOn) {
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
  } else if (char === 'w') {
    // WATCH MODE TOGGLE
    watcherOn = !watcherOn
    userInputConfirmLog('WATCHER: ' + (watcherOn ? 'ON' : 'OFF'))
  } else if (char === 'r') {
    userInputConfirmLog('RESTARTING SERVER')
    process.exit(1)
  } else {
    process.stdout.write(char)
  }
}