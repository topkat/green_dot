#!/usr/bin/env node
// --showConfig  --no-warnings --loader ts-node/esm


// /!\ TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE /!\ \\
// because we don't want a 500MB node_modules tree
// to be loaded just for a very simple process launcher
import { Command } from 'commander'
import { clearCli, cliArgsToEnv, greenDotCliIntro } from './helpers/cli.js'
import { startChildProcess } from './helpers/processManager.js'
import { C } from 'topkat-utils'
import { onFileChange } from './helpers/fileWatcher.js'
import { parentProcessExitCodes } from '../constants.js'
import { fileURLToPath } from 'url'
import { dirname, join, sep } from 'path'
import { readFileSync } from 'fs'
import { ensureDistFolderInFilePath } from './helpers/ensureDistFolderInFilePath.js'
import { CliCommands } from './types/command.types.js'
//   TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE   \\

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get version from package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'))
const version = packageJson.version

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
    arguments: [{
      name: 'type',
      description: `The type of thing to generate ('model' | 'svc' | 'service')`,
    }],
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
  upgrade: {
    description: 'Install the latest version of green_dot',
  },
} satisfies CommandPlus



//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╦╗╔╦
//  ╠══╝ ╠═╦╝ ║  ║ ║ ═╦ ╠═╦╝ ╠══╣ ║╚╝║
//  ╩    ╩ ╚  ╚══╝ ╚══╝ ╩ ╚  ╩  ╩ ╩  ╩

async function start() {
  try {
    clearCli()

    const program = new Command()
    program
      .name('green_dot')
      .description('green_dot CLI from green_dot backend framework')
      .version(version, '-v, --version')

    // Add all commands
    Object.entries(commands).forEach(([name, command]) => {
      const cmd = program
        .command(name)
        .description(command.description)

      // Add options if they exist
      if ('options' in command && command.options) {
        command.options.forEach(option => {
          if (option.type === Boolean) {
            cmd.option(`--${option.name}`, option.description)
          } else {
            cmd.option(`--${option.name} <value>`, option.description)
          }
        })
      }

      // Add arguments if they exist (like generate model === generate <argument>)
      if ('arguments' in command && command.arguments) {
        command.arguments.forEach(arg => {
          cmd.argument(arg.name, arg?.description)
        })
      }
    })

    // Parse arguments
    program.parse(process.argv)

    const _command = (program.args[0] || 'generate') as keyof typeof commands

    const args = program.opts()

    const command = commands[_command] || {}

    if (program.args.length && 'arguments' in command) {
      program.args.forEach((arg, i) => {
        if (i === 0) return
        args[command.arguments[i - 1].name] = arg
      })
    }

    await greenDotCliIntro({ subTitle: _command.toUpperCase() })

    // HACK in case it's in a blank folder, it will use green_dot from temp folder
    // location. This will mess with ESM and ts-node (global spaghetti shit metaverse hole here)
    const runGenerateFromDist = __dirname.includes(sep + '_npx' + sep) && _command === 'generate'

    const runFromDist = _command === 'start' || (_command === 'generate' && runGenerateFromDist)

    process.env.GREEN_DOT_INPUT_COMMAND = _command
    process.env.RUN_FROM_DIST = runFromDist.toString()

    process.env.TS_NODE_SKIP_IGNORE = 'true' // this one is a life saver days of work to find out

    cliArgsToEnv(args, false)

    let next: 'reload' | 'continue' = 'continue'
    let restartTimes = 0

    do {
      next = await new Promise(resolve => {
        try {
          const tsNodePath2 = import.meta.resolve('ts-node/esm')
          const classicImportEsm = 'ts-node/esm'
          const useClassic = true

          const additionalTsNodeArgsFirstArgs = runFromDist ? [] : ['--no-warnings', '--loader', useClassic ? classicImportEsm : tsNodePath2]

          const baseDir = runFromDist
            ? ensureDistFolderInFilePath(__dirname)
            : __dirname.replace(`dist${sep}`, '')

          const command = baseDir + (_command === 'start' ? `/startProdSpecialEntryPoint.` : `/childProcessEntryPoint.`) + (runFromDist ? 'js' : 'ts')

          startChildProcess(
            'node',
            [...additionalTsNodeArgsFirstArgs, command, _command],
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
type CommandPlus = Record<CliCommands | 'start' | 'upgrade', {
  description: string
  options?: Array<{
    name: string
    description?: string
    type: any
  }>,
  arguments?: Array<{
    name: string
    description?: string
  }>
}>
