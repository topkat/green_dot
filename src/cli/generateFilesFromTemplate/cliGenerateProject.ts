import { C } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot'
import { templater } from 'simple-file-templater'
import Path from 'path'
import { allPluginConfigs } from '../../plugins/pluginSystem'

const pluginNames = Object.keys(allPluginConfigs)

export async function cliGenerateProject() {

  const projectName = await luigi.askUserInput(`Greetings, carbon-based entity! What is the name of the project you want to create:`)

  const aa = await luigi.askSelection(
    'Which plugins do you want to install?',
    [{}],
    { multi: true }
  )

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