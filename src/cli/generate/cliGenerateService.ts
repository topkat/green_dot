
import Path from 'path'
import { templater } from 'simple-file-templater'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { C, capitalize1st } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot'
import { RateLimiterStr } from '../../security/serviceRouteRateLimiter'

export async function generateService(fileName: string) {

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

  const selection = await luigi.askSelection([
    `Let's go ?`
  ], [
    `OK`,
    `Advanced options`,
  ])

  let { displayApiMethodField, displayApiRouteField, docStyle, rateLimiter } = apiServiceDefaultOptions || {}

  if (selection === 'Advanced options') {

    luigi.tips(`In your green_dot.config.ts file, you can configure \`{ generateCommandOptions }\` to set the default values of a generated file`)

    docStyle = await luigi.askSelection(
      `What style of doc do you want to write for your service ?\n${C.dim('Doc are used to display info on hover in the SDK, generate Swagger doc...etc')}`,
      [
        { value: 'none' satisfies typeof docStyle, description: 'Only weaks need docs' },
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
    input: {
      exempleField: _.string()
    },
    output: _.undefined(),
    rateLimiter: '5/min',
    async main(ctx, {
        exempleField,
    }) {
        
    },
})

`
  await templater(
    Path.resolve(__dirname, './templates'),
    'TODO',
    [
      // ESM => COMMON JS

      // Import default
      [/import ([^\s]*) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
      // Import named
      [/import {([^}]+)} from ['"]([^'"]+)['"]/g, 'const {$1} = require(\'$2\')'],
      // Import all
      [/import \* as ([^\s]+) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
      // Export default
      [/export default ([^\s]+)/g, 'module.exports = $1'],
      // Export named
      [/export (?:const|let|var|function) ([^\s(]+) ?=?/g, 'exports.$1 ='],

      [/export \{/, 'module.exports = {'],
      // extensions in imports (avoid targetting package.json "exports")
      [/(import .*)\.mjs/g, `$1.cjs`],
      [/(require.*)\.mjs/g, `$1.cjs`],
    ],
    [
      ['.template', ''],
      ['.mjs', '.cjs'],
    ],
    [/\.ts$/]
  )



}


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
