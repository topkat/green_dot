#!/usr/bin/env ts-node


import { app, Command } from 'command-line-application'
import { C, objEntries, randomItemInArray } from 'topkat-utils'

import { buildCommand } from './build.command'
import { generateIndexForDbCachedFiles } from './build/generateIndexForDbCachedFiles'
import { initGreenDotConfigs } from '../helpers/getGreenDotConfigs'


//  ╦  ╦ ╔══╗ ╔══╗ ╔═══ ═╦═ ╔══╗ ╦╗ ╔
//  ╚╗ ║ ╠═   ╠═╦╝ ╚══╗  ║  ║  ║ ║╚╗║
//   ╚═╝ ╚══╝ ╩ ╚  ═══╝ ═╩═ ╚══╝ ╩ ╚╩

const cliVersion = '1.0.0'

//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝

const commands = {
  build: {
    description: 'Build SDKs and project',
    execute: buildCommand,
  },
  clean: {
    description: 'Clean files. Use this if you have problem with build',
    execute: clean,
  },
  generate: {
    description: 'Helps with generating new services (api routes, scheduled jobs...), new database models, new tests...',
    execute: generate,
  },
  start: {
    description: '',
    execute: start,
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
C.log('\n' + C.dim('='.repeat(50)))
C.log('\n' + C.green('◉') + ` green_dot ${C.dim(`cli ${' '.repeat(33 - cliVersion.length)}v${cliVersion}`)}\n`)
C.log(C.dim('='.repeat(50)))
C.log('\n🤖 < ' + randomItemInArray(['Welcome on board capitain!', 'What can I do for you today?', 'Hey, what\'s up?', 'Blip...bloup...bip..bip.........', 'Master the CLI you must, young Padawan']) + '\n\n')

const { _command, ...rest } = app({
  name: 'dot',
  description: 'dot CLI from green_dot backend framework',
  examples: objEntries(commands).map(([name, command]) => `dot ${name} # ${command.description}`),
  commands: objEntries(commands).map(([name, command]) => ({ name, ...command, execute: undefined }))
}) as { _command: keyof typeof commands }

commands[_command].execute(rest)




//  ╔══╗ ╔══╗ ╦╗╔╦ ╦╗╔╦ ╔══╗ ╦╗ ╔ ╔═╗  ╔═══
//  ║    ║  ║ ║╚╝║ ║╚╝║ ╠══╣ ║╚╗║ ║  ║ ╚══╗
//  ╚══╝ ╚══╝ ╩  ╩ ╩  ╩ ╩  ╩ ╩ ╚╩ ╚══╝ ═══╝

async function clean(props) {

  await generateIndexForDbCachedFiles()

  C.success('CLEAN' + props)
}

function generate(props) {
  C.success('GENERATE' + props)
}

async function start(props) {
  const appName = 'TODO'
  await initGreenDotConfigs({ appName })
  C.success('GENERATE' + props)
}