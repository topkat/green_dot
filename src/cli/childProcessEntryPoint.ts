// #!/usr/bin/env ts-node

import '../types/global.types'
import { buildCommand } from './build.command'
import { cleanCommand } from './clean.command'
import { generateCommand } from './generate.command'
import { startDevServerCommand, startProdServerCommand } from './startDevProdServer.command'
import { testCommand } from './test.command'


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
  /** Starts a server with hot reload */
  startServerDev: {
    execute: startDevServerCommand,
    exitAfter: true,
  },
  /** Starts a server with restart on error (max 10 times per 5 minutes) */
  startServer: {
    execute: startProdServerCommand,
    exitAfter: true,
  },
  /** Generate project files from templates */
  generate: {
    execute: generateCommand,
    exitAfter: true,
  },
  test: {
    execute: testCommand,
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