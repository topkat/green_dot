import { luigi } from '../helpers/luigi.bot.js'
import { templater } from 'simple-file-templater'
import Path, { dirname } from 'path'
import { allPluginConfigs } from '../../plugins/pluginSystem.js'
import { C, camelCaseToWords } from 'topkat-utils'
import { NewPluginAddToVariableTemplateCtx, NewPluginConfig } from '../../plugins/newPlugin.js'
import { execWaitForOutput } from 'topkat-utils/backend.js'
import { clearCli, greenDotCliIntro } from '../helpers/cli.js'
import { fileURLToPath } from 'url'
import { getPackageJsonVersion } from '../helpers/getPackageJsonVersion.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)



export async function cliGenerateProject() {

  const cwd = process.cwd()

  //  ╦╗ ╔ ╔══╗ ╦╗╔╦ ╔══╗   ╔══╗ ╦╗ ╔ ╔═╗    ╔══╗ ╔══╗ ╦    ╔═╗  ╔══╗ ╔══╗
  //  ║╚╗║ ╠══╣ ║╚╝║ ╠═     ╠══╣ ║╚╗║ ║  ║   ╠═   ║  ║ ║    ║  ║ ╠═   ╠═╦╝
  //  ╩ ╚╩ ╩  ╩ ╩  ╩ ╚══╝   ╩  ╩ ╩ ╚╩ ╚══╝   ╩    ╚══╝ ╚══╝ ╚══╝ ╚══╝ ╩ ╚
  let projectName = await luigi.askUserInput(`Greetings, carbon-based entity 🖖\nWhat is the name of the project you want to create:`)

  projectName = projectName.replace(/\s/g, '')

  const projectRootRelative = await luigi.askUserInput(`Where is your projet root path:\n${C.dim('relative to ' + cwd)}`, { default: '.' + Path.sep })

  const projectRoot = Path.resolve(cwd, projectRootRelative)

  //  ╔══╗ ╔══╗ ╦    ╔══╗ ╔═══
  //  ╠═╦╝ ║  ║ ║    ╠═   ╚══╗
  //  ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ═══╝
  const rolesStr = await luigi.askUserInput(
    `What are the roles in your app (comma separated list)?\n${C.dim(`Roles are central to your app, in green_dot, they represent each interface the users connects to (Eg: if you have a dashboard and a mobile app you should have 2 roles, this is very important as it will determine how SDKs are generated for the different interfaces you have and for different roles. For everything else, you should use permissions)`)}`,
    { default: 'user,admin', required: true }
  )

  const roles = rolesStr.split(',').map(s => s.trim())

  const platforms = roles.map(r => r + 'App')

  const sdkNameForRole = `{ ${roles.map((r, i) => `${r}: '${platforms[i]}'`).join(', ')} }`

  //  ╔══╗ ╦    ╦  ╦ ╔══╗ ═╦═ ╦╗ ╔ ╔═══
  //  ╠══╝ ║    ║  ║ ║ ═╦  ║  ║╚╗║ ╚══╗
  //  ╩    ╚══╝ ╚══╝ ╚══╝ ═╩═ ╩ ╚╩ ═══╝
  const selectedPlugins = await luigi.askSelection(
    'Which plugins do you want to install?',
    Object.values(allPluginConfigs).map(p => ({ name: p.name, value: p, description: p.docOneLine, checked: true })),
    { multi: true }
  )

  const ctx = { roles: roles as GD['role'][] } satisfies NewPluginAddToVariableTemplateCtx


  const allPluginsAsString = getStringFromPluginVar(ctx, selectedPlugins, p => (
    `new ${p.name}(${getValue(ctx, p.addToVariablesInNewProjectTemplate?.instanciatePluginInAppConfig) || `{ enable: true }`})`
  ))

  const addToGlobalType = getStringFromPluginVar(ctx, selectedPlugins, p => p.addToVariablesInNewProjectTemplate?.addToGlobalType)

  const addToEnvVariableImports = getStringFromPluginVar(ctx, selectedPlugins, p => p.addToVariablesInNewProjectTemplate?.addToEnvVariableImports)

  const importsFromGreenDot = getStringFromPluginVar(ctx, selectedPlugins, p => p.name, ', ')

  //  ══╦══ ╔══╗ ╦╗╔╦ ╔══╗ ╦    ╔══╗ ══╦══ ═╦═ ╦╗ ╔ ╔══╗
  //    ║   ╠═   ║╚╝║ ╠══╝ ║    ╠══╣   ║    ║  ║╚╗║ ║ ═╦
  //    ╩   ╚══╝ ╩  ╩ ╩    ╚══╝ ╩  ╩   ╩   ═╩═ ╩ ╚╩ ╚══╝

  clearCli()
  await greenDotCliIntro({ subTitle: 'GENERATE' })
  luigi.info('Generating project files...')

  await templater(
    Path.resolve(__dirname, '../../../templates/project'),
    projectRoot,
    [
      ['$$projectNameHyphens', camelCaseToWords(projectName).join('-').trim()],
      ['$$projectName', projectName],
      [`'$$pluginsAutocomplete'`, allPluginsAsString],
      [`$$addToGlobalType`, addToGlobalType],
      [`$$addToEnvVariableImports`, addToEnvVariableImports],
      [`'$$roles'`, `'` + roles.join(`', '`) + `'`],
      [`'$$platforms'`, `'` + platforms.join(`', '`) + `'`],
      [`'$$sdkNameForRole'`, sdkNameForRole],
      [`$$gdVersion`, getPackageJsonVersion()],
      [`$$importsFromGreenDot`, importsFromGreenDot]
    ],
    [
      ['.template', ''],
    ]
  )

  clearCli()
  await greenDotCliIntro({ subTitle: 'INSTALL DEPENDENCIES' })
  luigi.info('Running yarn...')

  await execWaitForOutput('yarn', { execOptions: { cwd: projectRoot }, nbSecondsBeforeKillingProcess: 300 })

  clearCli()
  await greenDotCliIntro({ subTitle: 'BUILDING PROJECT' })
  luigi.info('Running yarn build...')

  await execWaitForOutput('yarn build', {
    execOptions: { cwd: projectRoot },
    errorHandle: 'error',
    nbSecondsBeforeKillingProcess: 300
  })

  clearCli()
  await greenDotCliIntro({ subTitle: 'GENERATE' })
  luigi.info('Opening files in default editor...')

  await luigi.openFile(Path.resolve(projectRoot, './gd.config.ts'))
  await luigi.openFile(Path.resolve(projectRoot, './mainApp/gd.app.config.ts'))
  await luigi.openFile(Path.resolve(projectRoot, './mainDb/gd.db.config.ts'))

  C.log(`\n\n\n\n`)

  await luigi.info(`Wow! Such a work 🥵! It's your turn now:
1) Check open config files to adapt as you need
2) Relaunch \`npx green_dot generate\` or simply \`yarn generate\` equivalent to generate a service, a model, a database or even an app
3) Read the doc quick start: TODO link
4) Hover with your cursor nearly any green_dot thing to have the documentation to be displayed in your IDE`)
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
