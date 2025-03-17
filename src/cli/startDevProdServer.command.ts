
import { C } from 'topkat-utils'
import { StartServerConfig } from './dot.command'
import { buildCommand } from './build.command'
import { clearCli, cliIntro } from './helpers/cli'
import { autoFindAndInitActiveAppAndDbPaths, getProjectPaths } from '../helpers/getProjectPaths'
import { nestor } from './helpers/nestorBot'
import { onFileChange } from './fileWatcher'
import { startServer } from '../startServer'

let watcherOn = true


export async function startDevProdCommand(props: StartServerConfig) {

  await buildCommand(props)

  const { activeApp, appConfigs } = await getProjectPaths()

  if (!activeApp) {
    const folder = await nestor.askSelection({
      message: 'Which server do you want that I start ?',
      choices: appConfigs.map(appConf => appConf.folderPath)
    })

    nestor.confirm()

    autoFindAndInitActiveAppAndDbPaths(folder)
  }

  clearCli()
  cliIntro()

  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.on('data', userInputKeyHandler)

  nestor.say(`Starting server...\n
      -> Press "w" to toggle file watch and restart mode
      -> Press "r" to restart server manually
      -> Press "q" to quit
`)

  await startServer()

  // await timeout(200000)

  await onFileChange(() => {
    if (watcherOn) {
      C.log(`\n\n`)
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