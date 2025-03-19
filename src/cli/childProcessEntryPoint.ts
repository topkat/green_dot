// #!/usr/bin/env ts-node

import '../types/global.types'
import { buildCommand } from './build.command'
import { cleanCommand } from './clean.command'
import { startDevProdCommand } from './startDevProdServer.command'



export type ChildProcessCommands = keyof typeof commands

const [, , command] = process.argv as [string, string, ChildProcessCommands]


//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝



type CommandPlus = Record<string, { execute: Function, exitAfter?: boolean }>

const commands = {
  build: {
    execute: buildCommand,
    exitAfter: true,
  },
  clean: {
    execute: cleanCommand,
    exitAfter: true,
  },
  startServer: {
    execute: startDevProdCommand,
    exitAfter: true,
  },
} satisfies CommandPlus

//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╦╗╔╦
//  ╠══╝ ╠═╦╝ ║  ║ ║ ═╦ ╠═╦╝ ╠══╣ ║╚╝║
//  ╩    ╩ ╚  ╚══╝ ╚══╝ ╩ ╚  ╩  ╩ ╩  ╩

if (!command || !Object.keys(commands).includes(command)) throw new Error('Command not found ' + command)

async function startTask() {

  const { execute, exitAfter } = commands[command]

  await execute()

  if (exitAfter) process.exit(0)

}

startTask()