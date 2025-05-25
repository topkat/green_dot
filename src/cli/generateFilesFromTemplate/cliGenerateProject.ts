import { C } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot'
import { templater } from 'simple-file-templater'
import Path from 'path'

export async function cliGenerateProject() {

  const projectName = await luigi.askUserInput(`Greetings, carbon-based entity! What is the name of the project you want to create:`)

  await templater(
    Path.resolve(__dirname, './templates'),
    'TODO',
    [
      ['$$projectName', projectName],
    ],
    [
      ['.template', ''],
    ],
    [/\.ts$/]
  )
}