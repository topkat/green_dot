#!/usr/bin/env ts-node

// /!\ TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE /!\ \\
// because we don't want a 500MB node_modules tree
// to be loaded just for a very simple process launcher
import { app, Command } from 'command-line-application'
import { clearCli, cliIntro, cliArgsToEnv, checkTsNodeInstallation } from './helpers/cli'
import type { ChildProcessCommands } from './childProcessEntryPoint' // is not imported at runtime
import { startChildProcess } from './helpers/processManager'
import { C } from 'topkat-utils'
import { onFileChange } from './helpers/fileWatcher'
import { parentProcessExitCodes } from '../constants'
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
    description: 'Start a server in dev mode with hot reloading',
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
    cliIntro()

    const { _command, ...args } = app(
      {
        name: 'dot',
        description: 'dot CLI from green_dot backend framework',
        examples: Object.entries(commands).map(([name, command]) => `dot ${name} # ${command.description}`),
        commands: Object.entries(commands).map(([name, command]) => ({ name, ...command })),
      }, {
      error: 'throw'
    }) as { _command: keyof typeof commands }


    const c = commands[_command] as any as Required<CommandPlus[keyof CommandPlus]>
    console.log(`CLIAR`, args)

    console.log(`checkTsNodeInstallation()`, checkTsNodeInstallation())

    cliArgsToEnv(args, false)

    let next: 'reload' | 'continue' = 'continue'
    let restartTimes = 0

    do {
      next = await new Promise(resolve => {
        try {
          const programPath = tsNodePath

          console.log(`programPath2`, programPath)

          startChildProcess(
            programPath,
            [__dirname + '/childProcessEntryPoint.ts', _command],
            code => {
              console.error(`EXITED WITH CODE `, code)
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
                // clearCli()
                resolve('continue')
              }
            })
          console.log(`AFTERSTART`)
        } catch (err) {
          C.error(false, 'Error in child Processs coucou')
          C.error(err)
        }
      })
      cliArgsToEnv(args, true)
      console.log(`next`, next)
    } while (next === 'reload')
    console.log(`ENDDDO`)
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

type CommandPlus = Record<ChildProcessCommands, Omit<Command, 'name'> & {
  executeWith?: 'bun' | 'ts-node'
}>