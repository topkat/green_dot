import { luigi } from '../helpers/luigi.bot'
import { templater } from 'simple-file-templater'
import Path from 'path'
import { allPluginConfigs } from '../../plugins/pluginSystem'
import { C } from 'topkat-utils'
import { NewPluginAddToVariableTemplateCtx, NewPluginConfig } from '../../plugins/newPlugin'
import { execWaitForOutput } from 'topkat-utils/backend'





export async function cliGenerateProject() {

  const cwd = process.cwd()

  // NAME
  const projectName = await luigi.askUserInput(`Greetings, carbon-based entity 🖖\nWhat is the name of the project you want to create:`)

  // ROOT
  const projectRootRelative = await luigi.askUserInput(`Where is your projet root path:\n${C.dim('relative to ' + cwd)}`, { default: '.' + Path.sep })

  const projectRoot = Path.resolve(cwd, projectRootRelative)

  // ROLES
  const rolesStr = await luigi.askUserInput(
    `What are the roles in your app (comma separated list)?\n${C.dim(`Roles are central to your app, in green_dot, they represent each interface the users connects to (Eg: if you have a dashboard and a mobile app you should have 2 roles, this is very important as it will determine how SDKs are generated for the different interfaces you have and for different roles. For everything else, you should use permissions)`)}`,
    { default: 'user,admin', required: true }
  )

  const roles = rolesStr.split(',').map(s => s.trim())

  // PLUGINS
  const selectedPlugins = await luigi.askSelection(
    'Which plugins do you want to install?',
    Object.values(allPluginConfigs).map(p => ({ name: p.name, value: p, description: p.docOneLine, checked: true })),
    { multi: true }
  )

  const ctx = { roles: roles as GD['role'][] } satisfies NewPluginAddToVariableTemplateCtx


  const allPluginsAsString = getStringFromPluginVar(ctx, selectedPlugins, p => (
    `new ${p.name}(${getValue(ctx, p.addToVariablesInNewProjectTemplate?.instanciatePluginInAppConfig) || `{ enable: true }`}),`
  ))

  const addToGlobalType = getStringFromPluginVar(ctx, selectedPlugins, p => p.addToVariablesInNewProjectTemplate?.addToGlobalType)

  const addToEnvVariableImports = getStringFromPluginVar(ctx, selectedPlugins, p => p.addToVariablesInNewProjectTemplate?.addToEnvVariableImports)

  // import '../../../templates/project'

  await templater(
    Path.resolve(__dirname, '../../../templates/project'),
    projectRoot,
    [
      ['$$projectName', projectName],
      [`'$$pluginsAutocomplete'`, allPluginsAsString],
      [`$$addToGlobalType`, addToGlobalType],
      [`$$addToEnvVariableImports`, addToEnvVariableImports]
    ],
    [
      ['.template', ''],
    ]
  )

  await execWaitForOutput('yarn', { execOptions: { cwd: projectRoot } })
}


//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

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
