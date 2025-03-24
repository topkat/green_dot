
import fs from 'fs-extra'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { C, capitalize1st, camelCaseToWords } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot'
import { RateLimiterStr } from '../../security/serviceRouteRateLimiter'

export async function cliGenerateService(fileName: string, filePath: string) {

  const { allRoles, generateCommandOptions } = await getMainConfig()
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
    `Comma separated list for input parameters?\n${C.dim(`Eg: for a money transfer service, we may want "amount,currency,targetAccount...".\nLeave blank if your service has no parameters`)}`,
    { default: 'exemple' }
  )

  const inputParameters = inputParametersStr.split(',').map(p => p.trim())

  let { docStyle, rateLimiter } = apiServiceDefaultOptions || {}
  const { displayApiMethodField = false, displayApiRouteField = false } = apiServiceDefaultOptions || {}


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

    luigi.tips(`In your green_dot.config.ts file, you can configure \`{ generateCommandOptions }\` to set the default values of a generated file`)

    docStyle = await luigi.askSelection(
      `What style of doc do you want to write for your service ?\n${C.dim('Doc are used to display info on hover in the SDK, generate Swagger doc...etc')}`,
      [
        { value: 'none' satisfies typeof docStyle, description: 'Only the weaks need docs' },
        { value: 'simple' satisfies typeof docStyle, description: 'A simple line exmplaining your service' },
        { value: 'extended' satisfies typeof docStyle, description: 'An extended documentation with errors documented' },
      ] as const,
      { default: docStyle }
    )

    rateLimiter = await luigi.askSelection(
      `Do you want to set a rate limiter?\n${C.dim('Rate limiter is an important security feature that allow only a reasonable number of apiCalls in a given time window')}`,
      ['disable', '5/30s', '10/30s', '30/30s'] satisfies RateLimiterStr[]
    )

  }

  const file = `
import { svc, db, _ } from 'green_dot'


export const ${fileName} = svc({
    for: [${roles.length ? `'${roles.join(`', '`)}'` : ''}],
${docStyle === 'none' ? '' : docTemplate[docStyle] + '\n'}\
${method ? `    route: [${method}, ${route || camelCaseToWords(fileName).join('-')}],\n` : ''}\
${!method && route ? `    route: ${route},\n` : ''}\
${inputParameters ? inputParametersTemplate(inputParameters) + '\n' : ''}\
    output: _.string(), // TODO valid types are _.string(), _.model('myDb', 'modelName'), _.object({ a: _.number() })
${rateLimiter === 'disable' ? '' : `    rateLimiter: '${rateLimiter}',\n`}\
    async main(ctx${inputParameters ? '' : `, {${inputParameters.join(', ')}}`}) {
        return 'TODO'
    },
})
`

  await fs.outputFile(filePath, file, 'utf-8')

}

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

const docTemplate = {
  simple: `\
    doc: \`Write your service doc here\`,`,
  extended: `\
    doc: {
        description: \`TODO document this service (JSdoc like format, do not write params or returntype doc)\`,
        errors: [
            [404, 'notFound', \`This is an exemple Error description\`],
        ]
    },`
}

const inputParametersTemplate = (inputParameters: string[]) => `/
    input: {
      ${inputParameters.map(p => `      ${p}: _.string()\n`)}
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