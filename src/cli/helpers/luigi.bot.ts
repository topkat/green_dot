import { cliPrompt } from 'simple-cli-prompt'
import { asArray, C, randomItemInArray } from 'topkat-utils'
import { cutStringToTerminalLines, terminalCharSize } from './cli'

type CliPromptOptions = {
  choices: string[] | readonly string[]
  message?: string | string[]
}


export const luigi = {
  greet() {
    this.say([
      'Greetings, carbon-based entity! Awaiting instructions',
      'System online. Boot sequence complete. What’s the mission?',
      'Welcome on board capitain!',
      'What can I do for you today?',
      'Hey, what\'s up?', 'Blip...bloup...bip..bip.........',
      'Master the CLI you must, young Padawan'
    ])
  },
  confirm() {
    this.say([
      'Perfecto 👌',
      'Tutto bene 👌',
      'Sure thing!',
      'This is the way 🥷',
      'Roger that! Executing…',
      'Confirmed. The timeline remains intact... for now',
    ])
  },
  // messages: {
  //   serverStarted() {
  //     say([
  //       `Allocating 42 units of startup energy… Ready!`
  //     ])
  //   }
  // },
  async askConfirmation(
    message: string
  ): Promise<boolean> {
    return await cliPrompt({
      message: this.say(message, { log: false }),
      confirm: true,
    })
  },
  async askSelection<T extends CliPromptOptions>(
    config: T
  ): Promise<T['choices'][number]> {
    return await cliPrompt({
      message: config.message ? this.say(config.message, { log: false }) : undefined,
      choices: config.choices
    })
  },
  say(sentence: string[] | string, { log = 'log' }: { log?: false | 'log' | 'warning' | 'error' } = {}) {
    const lines = cutStringToTerminalLines(randomItemInArray(asArray(sentence)), terminalCharSize - 5).join('\n     ')
    const s = '🤖 < ' + lines + '\n\n'
    if (log !== false) C.log('\n')
    if (log === 'log') C.log(s)
    else if (log === 'warning') C.logClr(s, [255, 122, 0])
    else if (log === 'error') C.log(C.red(s))
    return s
  },
  warn(sentence: string[] | string) {
    return this.say(sentence, { log: 'warning' })
  }
}