#!/usr/bin/env ts-node


import { app, Command } from 'command-line-application'
import { objEntries } from 'topkat-utils'

import { buildCommand } from './build.command'
import '../types/global.types'
import { cleanCommand } from './clean.command'
import { cliIntro } from './helpers/cliIntro'
import { startDevProdCommand } from './startDevProdServer.command'

//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝

export type StartServerConfig = { env: 'dev' | 'prod' }

const commands = {
  build: {
    description: 'Build SDKs and project',
    execute: buildCommand,
  },
  clean: {
    description: 'Clean files. Use this if you have problem with build',
    execute: cleanCommand,
  },
  generate: {
    description: 'Helps with generating new services (api routes, scheduled jobs...), new database models, new tests...',
    execute: buildCommand,
  },
  start: {
    description: '',
    execute: startDevProdCommand,
  },
  dev: {
    description: '',
    execute: startDevProdCommand,
  },
  // dev: {
  //   description: 'Start a project in dev mode with hot reload',
  //   execute: dev,
  // },
  // start: {
  //   description: 'Start a project in production mode',
  //   execute: start,
  // }
} satisfies Record<string, Omit<Command, 'name'> & { execute: Function }>

//  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╦╗╔╦
//  ╠══╝ ╠═╦╝ ║  ║ ║ ═╦ ╠═╦╝ ╠══╣ ║╚╝║
//  ╩    ╩ ╚  ╚══╝ ╚══╝ ╩ ╚  ╩  ╩ ╩  ╩

cliIntro()

const { _command, ...args } = app({
  name: 'dot',
  description: 'dot CLI from green_dot backend framework',
  examples: objEntries(commands).map(([name, command]) => `dot ${name} # ${command.description}`),
  commands: objEntries(commands).map(([name, command]) => ({ name, ...command, execute: undefined }))
}) as { _command: keyof typeof commands }

commands[_command].execute(parseArgs(args))

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

function parseArgs(args: Record<string, any>) {
  const argsParsed = { env: 'dev' } as StartServerConfig

  if (args.prod === true || args.production === true) argsParsed.env = 'prod'

  return argsParsed
}