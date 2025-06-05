// /!\ TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE /!\ \\
import { C, minMax } from 'topkat-utils'
import pkg from '../../../package.json'


export const terminalCharSize = minMax(process.stdout.columns || 40, 30, 80)


export function cliIntro({
  title = '',
  subTitle = '',
  rightText = '',
} = {}) {
  C.log('\n' + C.dim('='.repeat(terminalCharSize)))
  C.log('\n' + `${title} ${C.dim(`${subTitle} ${' '.repeat((terminalCharSize - 13) - rightText.length - subTitle.length)}${rightText}`)}\n`)
  C.log(C.dim('='.repeat(terminalCharSize)))
}

export function greenDotCliIntro(param: Parameters<typeof cliIntro>[0] = {}) {
  return cliIntro({
    title: C.green('◉') + ' green_dot',
    subTitle: 'cli',
    rightText: 'v' + pkg.version,
    ...param,
  })
}

export function clearCli() {
  process.stdout.write('\x1Bc')
}

export const wrapCliText = (str: string, width = terminalCharSize) => str.match(new RegExp(`(.{0,${width}})(\\s|$)`, 'g'))?.map(l => l.trim()) || []


//  ╔══╗ ╦    ═╦═   ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ║    ║     ║    ╠══╣ ╠═╦╝ ║ ═╦ ╚══╗
//  ╚══╝ ╚══╝ ═╩═   ╩  ╩ ╩ ╚  ╚══╝ ═══╝

type ConfigFromCli = { env: 'dev' | 'prod', isReload: boolean }

const defaultEnv = { env: 'dev', isReload: false } satisfies ConfigFromCli


export function cliArgsToEnv(args: Record<string, any>, isReload: boolean) {

  const argsParsed = { env: 'dev', isReload, ...args } as ConfigFromCli

  if (args.production === true) argsParsed.env = 'prod'

  process.env.GREEN_DOT_CLI_PARAMS = JSON.stringify(argsParsed)

}

export function getServerConfigFromEnv<AdditionalEnv extends Record<string, any> = {}>() {
  return JSON.parse(process.env.GREEN_DOT_CLI_PARAMS || JSON.stringify(defaultEnv)) as ConfigFromCli & AdditionalEnv
}

//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

/** Green background log */
export function userInputConfirmLog(txt: string) {
  C.log(C.logClr(C.bg(0, 255, 0) + ' ' + txt + ' '))
}

/** A cli "badge" with inverted background and foreground colors */
export function cliBadge(txt: string) {
  return C.bg(200, 200, 200) + C.rgb(0, 0, 0) + ' ' + txt + ' ' + C.reset
}



type UserInputKyHandlerConfig = {
  customKeyHandler: (char: string, hex: string) => { wasHandled: boolean },
  onExit?: () => any
}


export function userInputKeyHandler(buff, { customKeyHandler, onExit }: UserInputKyHandlerConfig) {

  const char = buff.toString()
  const hex = buff.toString('hex')

  if (hex === '03' || hex === '04' || char === 'q') { // Ctrl+C
    userInputConfirmLog('QUIT')
    if (onExit) onExit()
    process.stdin.setRawMode(false)
    process.stdin.pause()
    process.exit(0)
  } else if (hex === '0C') { // Ctrl+L (Clear Screen)
    clearCli()
  } else if (hex === '0B') { // Ctrl+K (Clear Line from Cursor)
    process.stdout.write('\x1b[K') // ANSI escape sequence
  } else if (hex === '7F') { // Backspace
    process.stdout.write('\b \b') // Erase last character
  } else if (hex === '09') {
    process.stdout.write('  ') // Simulate tab spaces
  } else if (hex === '0D') {
    process.stdout.write('\n')// Newline
  }

  if (!customKeyHandler(char, hex).wasHandled) process.stdout.write(char)
}
