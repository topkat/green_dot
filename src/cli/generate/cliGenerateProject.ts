import { C } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot'


export async function cliGenerateProject() {

  const projectName = await luigi.askUserInput(`Greetings, carbon-based entity! What is the name of the project you want to create:`)

  // TODO
  C.log(`pro`, projectName)

  // await templater(
  //   Path.resolve(__dirname, './templates'),
  //   'TODO',
  //   [
  //     // ESM => COMMON JS

  //     // Import default
  //     [/import ([^\s]*) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
  //     // Import named
  //     [/import {([^}]+)} from ['"]([^'"]+)['"]/g, 'const {$1} = require(\'$2\')'],
  //     // Import all
  //     [/import \* as ([^\s]+) from ['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')'],
  //     // Export default
  //     [/export default ([^\s]+)/g, 'module.exports = $1'],
  //     // Export named
  //     [/export (?:const|let|var|function) ([^\s(]+) ?=?/g, 'exports.$1 ='],

  //     [/export \{/, 'module.exports = {'],
  //     // extensions in imports (avoid targetting package.json "exports")
  //     [/(import .*)\.mjs/g, `$1.cjs`],
  //     [/(require.*)\.mjs/g, `$1.cjs`],
  //   ],
  //   [
  //     ['.template', ''],
  //     ['.mjs', '.cjs'],
  //   ],
  //   [/\.ts$/]
  // )
}