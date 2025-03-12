#!/usr/bin/env ts-node

import Path from 'path'
import fs from 'fs-extra'
import { app, Command } from 'command-line-application'
import { C, objEntries, randomItemInArray, perfTimer } from 'topkat-utils'
import { getProjectPaths } from '../databases/helpers/getProjectPaths'
import { generateIndexForProjectDb } from '../generate/generateIndexForDb'
import { generateDbCachedFiles, generateDbIndexFile } from '../generate/generateCachedFiles/generateDbCachedFiles'

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
    execute: build,
  },
  clean: {
    description: 'Clean files. Use this if you have problem with build',
    execute: clean,
  },
  generate: {
    description: 'Helps with generating new services (api routes, scheduled jobs...), new database models, new tests...',
    execute: generate,
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


async function build(props) {

  const time = perfTimer()

  await generateIndexForProjectDb()

  await generateDbCachedFiles()

  C.success(`Successfully built green_dot project in ${time.end()}`)

}





async function clean(props) {

  await generateDbIndexFile()

  C.success('CLEAN')
}





function generate(props) {
  C.success('GENERATE')
}



