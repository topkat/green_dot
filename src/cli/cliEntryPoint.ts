#!/usr/bin/env ts-node
// --showConfig

// /!\ TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE /!\ \\
// because we don't want a 500MB node_modules tree
// to be loaded just for a very simple process launcher
import { app, Command } from 'command-line-application'
import { clearCli, cliArgsToEnv, greenDotCliIntro } from './helpers/cli'
import type { ChildProcessCommands } from './childProcessEntryPoint' // is not imported at runtime
import { startChildProcess } from './helpers/processManager'
import { C } from 'topkat-utils'
import { onFileChange } from './helpers/fileWatcher'
import { parentProcessExitCodes } from '../constants'
import Path from 'path'
//   TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE   \\


const [tsNodePath] = process.argv

//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝

const commands = {
  build: {
    description: 'Build SDKs and project',
  },
  clean: {
    description: 'Clean files. Use this if you have problem with build',
  },
  dev: {
    description: 'Start a server in dev mode with hot reloading',
  },
  start: {
    description: 'Start a server in in production mode, use this when you want to deploy and run the code',
  },
  publishSdks: {
    description: 'Publish the SDKs to NPM (interactive prompt)',
  },
  generate: {
    description: 'Helps with generating new services (api routes, scheduled jobs...), new database models, new tests...',
    executeWith: 'bun',
  },
  test: {
    description: 'Launch tests',
    options: [{
      name: 'filter',
      description: 'filter=user will only pass tests that contains user in their name',
      type: String
    }, {
      name: 'ci',
      type: Boolean,
      description: `Run tests in CI mode: will fail and quit process with code 1 on the first error`,
    }],
  },
} satisfies CommandPlus



//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╦╗╔╦
//  ╠══╝ ╠═╦╝ ║  ║ ║ ═╦ ╠═╦╝ ╠══╣ ║╚╝║
//  ╩    ╩ ╚  ╚══╝ ╚══╝ ╩ ╚  ╩  ╩ ╩  ╩

async function start() {
  try {

    clearCli()

    const { _command, ...args } = app(
      {
        name: 'dot',
        description: 'dot CLI from green_dot backend framework',
        examples: Object.entries(commands).map(([name, command]) => `dot ${name} # ${command.description}`),
        commands: Object.entries(commands).map(([name, command]) => ({ name, ...command })),
      }, {
      error: 'throw'
    }) as { _command: keyof typeof commands }

    greenDotCliIntro({ subTitle: _command.toUpperCase() })

    // const c = commands[_command] as any as Required<CommandPlus[keyof CommandPlus]>
    const runFromDist = _command === 'start' //_command === 'build'


    process.env.GREEN_DOT_INPUT_COMMAND = _command
    process.env.RUN_FROM_DIST = runFromDist.toString()

    cliArgsToEnv(args, false)

    let next: 'reload' | 'continue' = 'continue'
    let restartTimes = 0

    do {
      next = await new Promise(resolve => {
        try {
          const programPath = runFromDist ? 'node' : tsNodePath

          const baseDir = runFromDist ? __dirname.replace(`(dist)?${Path.sep}src`, `dist${Path.sep}src`) : __dirname.replace('dist' + Path.sep, '')

          const command = baseDir + (_command === 'start' ? `/startProdSpecialEntryPoint.` : `/childProcessEntryPoint.`) + (runFromDist ? 'js' : 'ts')

          startChildProcess(
            programPath,
            [command, _command],
            code => {
              if (!code || code === parentProcessExitCodes.exit) {
                // SUCCESS EXIT
                resolve('continue')
              } else if (code === parentProcessExitCodes.waitForFileChange) {
                // HOT RELOAD
                C.log('\n\n')
                C.warning(false, `Waiting for file change before restarting process...\n\n`)
                onFileChange(async path => {
                  if (path.includes('generated')) return

                  C.info(`File change detected for ${path}, restarting (cp)...`)
                  C.log(`\n\n`)
                  resolve('reload')
                })
              } else if (code === parentProcessExitCodes.restartServer) {
                // SIMPLE RESTART
                setTimeout(() => {
                  restartTimes-- // reset restartTimes after a certain amount of time
                }, 5 * 60 * 1000)
                if (restartTimes > 10) throw new Error('Process restarted more than 10 times in the last 3 minutes. Stopping process...')
                C.log('\n\n')
                C.warning(false, `Restarting server...\n\n`)
                resolve('reload')
                restartTimes++
              } else {
                // ERROR EXIT RESTART PROCESS
                C.error(false, `Error in child processs. Exit with code ${code}`)
                process.exit(code)
              }
            })
        } catch (err) {
          C.error(false, 'Error in child processs start')
          C.error(err)
        }
      })
      cliArgsToEnv(args, true)
    } while (next === 'reload')
    process.exit(0)

  } catch (err) {
    const message = err && err.message
    if (message && message.includes('Found unknown command')) {
      C.error(false, message + '\n')
      C.info(`Available commands: ${Object.keys(commands).join(', ')}`)
      C.log('\n')
    } else C.error(err)
    process.exit(1)
  }
}


start()


//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

type CommandPlus = Record<ChildProcessCommands | 'start', Omit<Command, 'name'> & {
  executeWith?: 'bun' | 'ts-node'
}>