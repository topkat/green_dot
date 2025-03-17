

import fs from 'fs-extra'
import Path from 'path'
import { C } from 'topkat-utils'
import { createNewTask } from './createNewTask'
import { generateIndexForDbCachedFiles } from './build/generateIndexForDbCachedFiles'
import { StartServerConfig } from './dot.command'
import { buildCommand } from './build.command'
import { clearCli, cliIntro } from './helpers/cliIntro'
import { autoFindAndInitActiveAppAndDbPaths, getProjectPaths } from '../helpers/getProjectPaths'
import { cliPrompt } from 'simple-cli-prompt'
import { nestor } from './helpers/nestorBot'
import { onFileChange } from './fileWatcher'
import { startServer } from '../startServer'


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

  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (key) => {
    if (key === '\u0003' as any) { // Detect Ctrl+C
      console.log('\nExiting...')
      process.exit()
    }

    console.log(`You pressed: ${key}`)
    process.stdin.setRawMode(false) // Disable raw mode after first input
    process.stdin.pause() // Stop listening
  })


  nestor.say('To toggle file watch and restart mode press "w"')

  // await startServer()

  await onFileChange(() => {
    C.log(`\n\n`)
    process.exit(1)
  })



}