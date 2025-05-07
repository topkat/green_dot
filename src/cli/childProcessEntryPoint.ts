// #!/usr/bin/env ts-node

console.log('ENTRY')

import '../types/global.types'
console.log('IMP1')
import { buildCommand } from './build.command'
console.log('IMP2')
import { cleanCommand } from './clean.command'
console.log('IMP3')
import { generateCommand } from './generate.command'
console.log('IMP4')
import { startDevServerCommand, startProdServerCommand } from './startDevProdServer.command'
console.log('IMP6')
import { testCommand } from './test.command'

console.log(`CHILDPROCESS`)

export type ChildProcessCommands = keyof typeof commands

const [, , command] = process.argv as [string, string, ChildProcessCommands]

//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝

type CommandPlus = Record<string, { execute: Array<Function>, exitAfter?: boolean }>

const commands = {
  build: {
    execute: [buildCommand],
    exitAfter: true,
  },
  clean: {
    execute: [cleanCommand],
    exitAfter: true,
  },
  /** Starts a server with hot reload */
  dev: {
    execute: [buildCommand, startDevServerCommand],
    exitAfter: true,
  },
  /** Starts a server with restart on error (max 10 times per 5 minutes) */
  start: {
    execute: [buildCommand, startProdServerCommand],
    exitAfter: false,
  },
  /** Generate project files from templates */
  generate: {
    execute: [generateCommand],
    exitAfter: true,
  },
  publishSdks: {
    execute: [() => buildCommand({ publishSdks: true })],
    exitAfter: true,
  },
  test: {
    execute: [testCommand],
    exitAfter: true,
  },
} satisfies CommandPlus

//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╦╗╔╦
//  ╠══╝ ╠═╦╝ ║  ║ ║ ═╦ ╠═╦╝ ╠══╣ ║╚╝║
//  ╩    ╩ ╚  ╚══╝ ╚══╝ ╩ ╚  ╩  ╩ ╩  ╩

if (!command || !Object.keys(commands).includes(command)) throw new Error('Command not found ' + command)

async function startTask() {

  const { execute, exitAfter } = commands[command]

  do {
    const next = execute.shift()
    await next()
  } while (execute.length)

  if (exitAfter) process.exit(0)

}

startTask()