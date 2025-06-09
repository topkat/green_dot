#!/usr/bin/env node

import '../types/global.types.js'
import type { CliCommands } from './types/command.types.js'

export type ChildProcessCommands = CliCommands

const [, , processCommand] = process.argv as [string, string, ChildProcessCommands]

//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝

type CommandPlus = Record<string, { execute: Array<Function>, exitAfter?: boolean }>

const commands = {
  build: {
    execute: [async () => {
      const { buildCommand } = await import('./build.command.js')
      return buildCommand({ tsc: true })
    }],
    exitAfter: true,
  },
  clean: {
    execute: [async () => {
      const { cleanCommand } = await import('./clean.command.js')
      return cleanCommand()
    }],
    exitAfter: true,
  },
  /** Starts a server with hot reload */
  dev: {
    execute: [
      async () => {
        const { buildCommand } = await import('./build.command.js')
        return buildCommand({ tsc: false })
      },
      async () => {
        const { startDevServerCommand } = await import('./startDevServer.command.js')
        return startDevServerCommand()
      }
    ],
    exitAfter: true,
  },
  /** Generate project files from templates */
  generate: {
    execute: [async () => {
      const { generateCommand } = await import('./generate.command.js')
      return generateCommand()
    }],
    exitAfter: true,
  },
  publishSdks: {
    execute: [async () => {
      const { buildCommand } = await import('./build.command.js')
      return buildCommand({ publishSdks: true })
    }],
    exitAfter: true,
  },
  test: {
    execute: [async () => {
      const { testCommand } = await import('./test.command.js')
      return testCommand()
    }],
    exitAfter: true,
  },
  upgrade: {
    execute: [async () => {
      const { upgradeCommand } = await import('./upgrade.command.js')
      return upgradeCommand()
    }],
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
    try {
      const next = await execute.shift()
      await next()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      throw err
    }
  } while (execute.length)

  if (exitAfter) process.exit(0)
}

startTask()