
import { C } from 'topkat-utils'
import pkg from '../../../package.json'

export const terminalCharSize = 50

export function cliIntro() {
  const cliVersion = pkg.version
  C.log('\n' + C.dim('='.repeat(terminalCharSize)))
  C.log('\n' + C.green('◉') + ` green_dot ${C.dim(`cli ${' '.repeat((terminalCharSize - 17) - cliVersion.length)}v${cliVersion}`)}\n`)
  C.log(C.dim('='.repeat(50)))
}

export function clearCli() {
  // process.stdout.write('\x1Bc')
}

const wrapText = (str: string, width: number) => str.match(new RegExp(`(.{1,${width}})(\\s|$)`, 'g'))?.map(l => l.trim()) || []

export function cutStringToTerminalLines(str: string, size: number) {
  return wrapText(str, size || terminalCharSize)
}