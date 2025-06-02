import { luigi } from '../helpers/luigi.bot'
import { templater } from 'simple-file-templater'
import Path from 'path'
import { allPluginConfigs } from '../../plugins/pluginSystem'
import { C } from 'topkat-utils'
import { NewPluginAddToVariableTemplateCtx, NewPluginConfig } from '../../plugins/newPlugin'





export async function cliGenerateProject() {

  const projectName = await luigi.askUserInput(`Greetings, carbon-based entity! What is the name of the project you want to create:`)

  const rolesStr = await luigi.askUserInput(
    `What are the roles in your app (comma separated list)?\n${C.dim(`Roles are central to your app, in green_dot, they represent each interface which the users connects to (Eg: if you have a dashboard and a mobile app you should have 2 roles, this is very important as it will determine how SDKs are generated for the different interfaces you have and for different roles. For everything else, you should use permissions)`)}`,
    { default: 'user,admin', required: true }
  )

  const roles = rolesStr.split(',').map(s => s.trim())

  const selectedPlugins = await luigi.askSelection(
    'Which plugins do you want to install?',
    Object.values(allPluginConfigs).map(p => ({ name: p.name, value: p, description: p.docOneLine })),
    { multi: true }
  )

  const ctx = { roles: roles as GD['role'][] } satisfies NewPluginAddToVariableTemplateCtx


  const allPluginsAsString = getStringFromPluginVar(ctx, selectedPlugins, p => (
    `new ${p.name}(${getValue(ctx, p.addToVariablesInNewProjectTemplate.instanciatePluginInAppConfig) || `{ enable: true }`}),`
  ))

  const addToGlobalType = getStringFromPluginVar(ctx, selectedPlugins, p => p.addToVariablesInNewProjectTemplate?.addToGlobalType)

  const addToEnvVariableImports = getStringFromPluginVar(ctx, selectedPlugins, p => p.addToVariablesInNewProjectTemplate?.addToEnvVariableImports)

  await templater(
    Path.resolve(__dirname, './templates'),
    'TODO',
    [
      ['$$projectName', projectName],
      [`'$$pluginsAutocomplete'`, allPluginsAsString],
      [`$$addToGlobalType`, addToGlobalType],
      [`$$addToEnvVariableImports`, addToEnvVariableImports]
    ],
    [
      ['.template', ''],
    ],
    [/\.ts$/]
  )
}


function getStringFromPluginVar(
  ctx,
  pluginConf: NewPluginConfig<any, any, any>[],
  callback: (p: NewPluginConfig<any, any, any>) => any,
  joinStr = ',\n    '
) {
  return pluginConf.map(p => getValue(ctx, callback(p))).filter(s => s).join(joinStr).replace(/,,/, ',')
}


function getValue<T>(ctx, v: T): T extends GenericFunction ? ReturnType<T> : T {
  return typeof v === 'function' ? v(ctx) : v as any
}
