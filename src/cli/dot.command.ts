// #!/usr/bin/env ts-node

import { app, Command } from 'command-line-application'
import { C, objEntries } from 'topkat-utils'

import { buildCommand } from './build.command'
import '../types/global.types'
import { cleanCommand } from './clean.command'
import { clearCli, cliIntro } from './helpers/cli'
import { startDevProdCommand } from './startDevProdServer.command'



export type ChildProcessCommands = keyof typeof commands

const [programPath, fileName, command] = process.argv as [string, string, ChildProcessCommands]


//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝



type CommandPlus = Record<string, Omit<Command, 'name'> & { execute: Function, exitAfter?: boolean }>

const commands = {
  build: {
    description: 'Build SDKs and project',
    execute: buildCommand,
    exitAfter: true,
  },
  clean: {
    description: 'Clean files. Use this if you have problem with build',
    execute: cleanCommand,
    exitAfter: true,
  },
  startServer: {
    description: 'Clean files. Use this if you have problem with build',
    execute: cleanCommand,
    exitAfter: true,
  },
  // dev: {
  //   description: '',
  //   execute: () => {
  //     startProcess([__dirname + '/startDevProdServer.command.ts', ...args])
  //   },
  // },
  // generate: {
  //   description: 'Helps with generating new services (api routes, scheduled jobs...), new database models, new tests...',
  //   execute: buildCommand,
  // },
} satisfies CommandPlus

//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╦╗╔╦
//  ╠══╝ ╠═╦╝ ║  ║ ║ ═╦ ╠═╦╝ ╠══╣ ║╚╝║
//  ╩    ╩ ╚  ╚══╝ ╚══╝ ╩ ╚  ╩  ╩ ╩  ╩

if (!command || !Object.keys(commands).includes(command)) throw new Error('Command not found ' + command)

console.log(`command`, command)

// clearCli()
// cliIntro()

// try {

//   const { _command, ...args } = app(
//     {
//       name: 'dot',
//       description: 'dot CLI from green_dot backend framework',
//       examples: objEntries(commands).map(([name, command]) => `dot ${name} # ${command.description}`),
//       commands: objEntries(commands).map(([name, command]) => ({ name, ...command, execute: undefined, exitAfter: undefined })),
//     }, {
//     error: 'throw'
//   }) as { _command: keyof typeof commands }

//   cliArgsToEnv(args)

//   commands[_command].execute(parseArgs(args)).then(() => {
//     const c = commands[_command] as any as Required<CommandPlus[keyof CommandPlus]>
//     if (c.exitAfter) process.exit(0)
//   })

// } catch (err) {
//   const msg = err && err.message
//   if (msg && msg.includes('Found unknown command')) {
//     C.error(false, msg + '\n')
//     C.info(`Available commands: ${Object.keys(commands).join(', ')}`)
//     C.log('\n')
//   } else C.error(err)
//   process.exit(1)
// }