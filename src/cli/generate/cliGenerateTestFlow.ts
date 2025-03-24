
import fs from 'fs-extra'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { C, capitalize1st, camelCaseToWords } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot'
import { RateLimiterStr } from '../../security/serviceRouteRateLimiter'

export async function cliGenerateTestFlow(fileName: string, filePath: string) {


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