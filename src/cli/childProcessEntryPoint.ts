#!/usr/bin/env node --loader ts-node/esm

import '../types/global.types'
import { buildCommand } from './build.command'
import { cleanCommand } from './clean.command'
import { generateCommand } from './generate.command'
import { startDevServerCommand } from './startDevServer.command'
import { testCommand } from './test.command'


export type ChildProcessCommands = keyof typeof commands

const [, , processCommand] = process.argv as [string, string, ChildProcessCommands]

//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝

type CommandPlus = Record<string, { execute: Array<Function>, exitAfter?: boolean }>

const commands = {
  build: {
    execute: [() => buildCommand({ tsc: true })],
    exitAfter: true,
  },
  clean: {
    execute: [cleanCommand],
    exitAfter: true,
  },
  /** Starts a server with hot reload */
  dev: {
    execute: [() => buildCommand({ tsc: false }), startDevServerCommand],
    exitAfter: true,
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

export async function startTask(command = processCommand) {

  if (!command || !Object.keys(commands).includes(command)) throw new Error('Command not found ' + command)

  const { execute, exitAfter } = commands[command]

  do {
    const next = execute.shift()
    await next()
  } while (execute.length)

  if (exitAfter) process.exit(0)

}

startTask()