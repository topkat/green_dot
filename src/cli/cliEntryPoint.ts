#!/usr/bin/env ts-node

// /!\ TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE /!\ \\
// because we don't want a 500MB node_modules tree
// to be loaded just for a very simple process launcher
import { app, Command } from 'command-line-application'
import { clearCli, cliIntro, cliArgsToEnv } from './helpers/cli'
import type { ChildProcessCommands } from './childProcessEntryPoint' // is not imported at runtime
import { startChildProcess } from './helpers/processManager'
import { C } from 'topkat-utils'
import { onFileChange } from './helpers/fileWatcher'
//   TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE   \\

const [tsNodePath] = process.argv

//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝

const commands = {
  build: {
    description: 'Build SDKs and project',
    steps: [
      'build'
    ],
    exitAfter: true,
  },
  clean: {
    description: 'Clean files. Use this if you have problem with build',
    steps: [
      'clean'
    ],
    exitAfter: true,
  },
  dev: {
    description: 'Start a server in dev mode with hot reloading',
    steps: [
      'buildDev',
      'startServer'
    ],
    exitAfter: true,
  },
  generate: {
    description: 'Helps with generating new services (api routes, scheduled jobs...), new database models, new tests...',
    // executeWith: 'bun',
    steps: [
      'generate'
    ],
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
    steps: [
      'test'
    ],
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
        commands: Object.entries(commands).map(([name, command]) => ({ name, ...command, steps: undefined })),
      }, {
      error: 'throw'
    }) as { _command: keyof typeof commands }

    cliArgsToEnv(args, false)

    const c = commands[_command] as any as Required<CommandPlus[keyof CommandPlus]>

    let next: 'reload' | 'continue' = 'continue'

    do {
      for (const step of c.steps) {
        next = await new Promise(resolve => {

          const programPath = c?.executeWith === 'bun' ? 'bun' : tsNodePath

          startChildProcess(programPath, [__dirname + '/childProcessEntryPoint.ts', step], code => {
            if (!code || code === 0) {
              // SUCCESS EXIT
              resolve('continue')
            } else if (code === 201) {
              // HOT RELOAD
              C.log('\n\n')
              C.warning(false, `Waiting for file change before restarting process...\n\n`)
              onFileChange(async path => {
                if (path.includes('generated')) return

                C.info(`File change detected for ${path}, restarting (cp)...`)
                C.log(`\n\n`)
                resolve('reload')
              })
            } else if (code === 202) {
              // SIMPLE RESTART
              C.log('\n\n')
              C.warning(false, `Restarting server...\n\n`)
              resolve('reload')
            } else {
              // ERROR EXIT RESTART PROCESS
              // clearCli()
              resolve('continue')
            }
          })
        })

        if (next === 'reload') {
          cliArgsToEnv(args, true)
          break
        }
      }
    } while (next === 'reload')

    if (c.exitAfter) process.exit(0)

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

type CommandPlus = Record<string, Omit<Command, 'name'> & {
  steps: ChildProcessCommands[]
  exitAfter?: boolean,
  executeWith?: 'bun' | 'ts-node'
}>