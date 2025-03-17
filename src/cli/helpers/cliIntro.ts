
import { C } from 'topkat-utils'
import pkg from '../../../package.json'
import { nestor } from './nestorBot'

export function cliIntro() {
  const cliVersion = pkg.version
  C.log('\n' + C.dim('='.repeat(50)))
  C.log('\n' + C.green('◉') + ` green_dot ${C.dim(`cli ${' '.repeat(33 - cliVersion.length)}v${cliVersion}`)}\n`)
  C.log(C.dim('='.repeat(50)))
  nestor.greet()
}

export function clearCli() {
  process.stdout.write('\x1Bc')
}