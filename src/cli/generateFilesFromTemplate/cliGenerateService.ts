
import fs from 'fs-extra'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { C, capitalize1st, camelCaseToWords } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot'
import { RateLimiterStr } from '../../security/serviceRouteRateLimiter'
import { getProjectPaths } from '../../helpers/getProjectPaths'

export async function cliGenerateService(fileName: string, filePath: string) {

  const { allRoles, generateCommandOptions } = await getMainConfig()
  const { dbConfigs } = await getProjectPaths()

  const { apiServiceDefaultOptions } = generateCommandOptions || {}

  const roles = await luigi.askSelection(
    `Who is allowed to access this route?`,
    [
      { name: 'Public (the route is available without connexion)', value: 'public' },
      ...allRoles.map(r => ({ name: capitalize1st(r), value: r }))
    ] as const,
    { multi: true }
  )

  const inputParametersStr = await luigi.askUserInput(
    `Comma separated list for input parameters?\n${C.dim(` * Eg: for a money transfer service, we may want "amount,currency,targetAccount...".\n * Leave blank if your service has no parameters or if you want to set them up later`)}`,
    { default: 'exemple' }
  )

  const inputParameters = inputParametersStr.split(',').map(p => p.trim())

  let { docStyle, rateLimiter } = apiServiceDefaultOptions || {}
  const { displayApiMethodField = false, displayApiRouteField = false } = apiServiceDefaultOptions || {}

  docStyle = await luigi.askSelection(
    `What style of doc do you want to write for your service ?\n${C.dim('Doc are used to display info on hover in the SDK, generate Swagger doc...etc')}`,
    [
      { value: 'none' satisfies typeof docStyle, description: 'Only the weaks need docs' },
      { value: 'simple' satisfies typeof docStyle, description: 'A simple line explaining your service (JSdoc like compatible)' },
      { value: 'extended' satisfies typeof docStyle, description: `An extended documentation (JSdoc like compatible) with errors documented as array (Eg: [404, 'notFound', 'Error description...'])` },
    ] as const,
    { default: docStyle }
  )

  const selection = await luigi.askSelection([
    `Let's go ?`
  ], [
    `OK`,
    `Advanced options`,
  ])

  const isAdvanced = selection === 'Advanced options'

  const method = displayApiMethodField || isAdvanced ? await getMethod() : undefined

  const route = displayApiRouteField || isAdvanced ? await getRoute() : undefined

  if (isAdvanced) {

    rateLimiter = await luigi.askSelection(
      `Do you want to set a rate limiter?\n${C.dim('Rate limiter is a security feature that allow only a certain number of apiCalls in a given time window for that service')}`,
      [
        { value: 'disable' satisfies RateLimiterStr, description: 'No rate limiter' },
        { value: '5/30s' satisfies RateLimiterStr, description: 'Allow 5 requests per 30 seconds max' },
        { value: '10/30s' satisfies RateLimiterStr, description: 'Allow 10 requests per 30 seconds max' },
        { value: '30/30s' satisfies RateLimiterStr, description: 'Allow 30 requests per 30 seconds max' }
      ] as const
    )

  }

  const file = `
import { svc, db,${dbConfigs.length > 1 ? ' dbs,' : ''} _ } from 'green_dot'


export const ${fileName} = svc({
    for: [${roles.length ? `'${roles.join(`', '`)}'` : ''}],
${docStyle === 'none' ? '' : docTemplate[docStyle] + '\n'}\
${method ? `    route: ['${method}', '${route || camelCaseToWords(fileName).join('-')}'],\n` : ''}\
${!method && route ? `    route: '${route}',\n` : ''}\
${inputParameters ? inputParametersTemplate(inputParameters) + '\n' : ''}\
    output: _.string(), // TODO valid types are _.string(), _.model('myDb', 'modelName'), _.object({ a: _.number() })...etc.
${rateLimiter === 'disable' ? '' : `    rateLimiter: '${rateLimiter}',\n`}\
    async main(ctx${inputParameters ? `, {${inputParameters.join(', ')}}` : ''}) {
        return 'TODO'
    },
})
`

  await fs.outputFile(filePath, file, 'utf-8')

  luigi.tips(`In your 'green_dot.config.ts' file, you can configure the default values for file generation via the param \`{ generateCommandOptions }\``)

}

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

const docTemplate = {
  simple: `\
    doc: \`Write your service doc here\`,`,
  extended: `\
    doc: {
        description: \`TODO document this service (JSdoc like format, do not write @params or @return, they will automatically be added)\`,
        errors: [
            [404, 'notFound', \`This is an exemple Error description\`],
        ]
    },`
}

const inputParametersTemplate = (inputParameters: string[]) => `\
    input: {
        ${inputParameters.map(p => `${p}: _.string()`).join(',\n        ')}
    },`


async function getMethod() {
  const meth = await luigi.askSelection(
    `Api Method (optional) ?\n${C.dim(`By default all routes are POST in green_dot, and everything is passed in req.body. Use this setting if you want to override the default behavior.`)}`,
    ['Keep default', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE',] as const,
    { default: 'Keep default' }
  )
  return meth === 'Keep default' || meth === 'POST' ? undefined : meth
}

async function getRoute() {
  const res = await luigi.askUserInput(
    `Api Route (optional) ?\n${C.dim(`By default routes are based on the service name. Eg: if the service is called subscribeToNewsletter, the generated route will be subscribe-to-newsletter`)}`,
    { default: 'Keep default' }
  )
  return res === 'Keep default' || !res ? undefined : res
}