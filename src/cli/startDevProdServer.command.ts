
import { C } from 'topkat-utils'
import { clearCli, cliBadge, cliIntro, userInputConfirmLog, userInputKeyHandler } from './helpers/cli'
import { autoFindAndInitActiveAppAndDbPaths, getProjectPaths } from '../helpers/getProjectPaths'
import { luigi } from './helpers/luigi.bot'
import { onFileChange } from './helpers/fileWatcher'
import { parentProcessExitCodes } from './cliEntryPoint'

let watcherOn = true

export async function startDevProdCommand({ mode = 'dev' as 'dev' | 'production' } = {}) {

  const { activeApp, appConfigs } = await getProjectPaths()

  if (!activeApp) {
    if (mode === 'production') {
      throw new Error('Please start the process in a green_dot.app folder (folder containing green_dot.APP.config.ts)')
    } else {
      const folder = await luigi.askSelection(
        'Which server do you want that I start ?',
        appConfigs.map(appConf => appConf.folderPath)
      )

      luigi.confirm()

      autoFindAndInitActiveAppAndDbPaths(folder)

      clearCli()
      cliIntro()
    }
  }

  if (mode === 'dev') {
    process.stdin.setRawMode?.(true)
    process.stdin.resume()
    process.stdin.on('data', buff => userInputKeyHandler(buff, {
      customKeyHandler(char) {
        if (char === 'h') {
          // WATCH MODE TOGGLE
          watcherOn = !watcherOn
          userInputConfirmLog('WATCHER: ' + (watcherOn ? 'ON' : 'OFF'))
        } else if (char === 'r') {
          userInputConfirmLog('RESTARTING SERVER')
          process.exit(parentProcessExitCodes.restartServer)
        } else return { wasHandled: false }
        return { wasHandled: true }
      }
    }))

    luigi.say(`Starting server...
    -> Press ${cliBadge('H')} to toggle hot-reload
    -> Press ${cliBadge('R')} to restart server
    -> Press ${cliBadge('Q')} to quit
`, { noWrap: true })
  }

  const { startServer, stopServer } = await import('green_dot' as any)

  const errorHandler = async err => {
    C.error(err)
    await stopServer()
    if (watcherOn === false) watcherOn = true

    const { restartServer, waitForFileChange } = parentProcessExitCodes

    // Don't put spinner here
    process.exit(mode === 'dev' ? waitForFileChange : restartServer) // hot reload
  }

  // Catch All App Errors, even the unhandled ones
  process.on('unhandledRejection', errorHandler)
  process.on('uncaughtException', errorHandler)

  try {
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
      process.exit(parentProcessExitCodes.restartServer)
    }
  })
}