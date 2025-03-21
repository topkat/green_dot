import { input, select, checkbox, confirm } from '@inquirer/prompts'
import { asArray, C, randomItemInArray } from 'topkat-utils'
import { wrapCliText, terminalCharSize } from './cli'


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
  async askUserInput(
    message: string
  ) {
    return await input({
      message: this.say(message, { log: false }),
    })
  },
  async askConfirmation(
    message: string
  ) {
    return await confirm({
      message: this.say(message, { log: false }),
    })
  },
  async askSelection<V extends string | { name?: string, value: string, description?: string }, C extends Omit<Parameters<typeof select>[0], 'message' | 'choices'> & { multi?: boolean }>(
    msg: string | string[],
    choices: readonly V[],
    config?: C
  ): Promise<C extends { multi: true } ? (V extends { value: any } ? V['value'] : V)[] : V extends { value: any } ? V['value'] : V> {
    const { multi = false } = config
    return await (multi ? checkbox : select)({
      message: luigi.say(msg, { log: false }),
      choices: choices as any,
      ...config,
    }) as any
  },
  say(
    sentence: string[] | string,
    { log = 'log', noWrap = false }: {
      log?: false | 'log' | 'warning' | 'error' | 'info'
      noWrap?: boolean
    } = {},
  ) {
    let lines: string
    if (noWrap) lines = randomItemInArray(asArray(sentence))
    else lines = wrapCliText(randomItemInArray(asArray(sentence)), terminalCharSize - 5).join('\n     ')
    const s = '🤖 < ' + lines + '\n\n'
    if (log !== false) C.log('\n')
    if (log === 'log') C.log(s)
    else if (log === 'warning') C.logClr(s, [255, 122, 0])
    else if (log === 'error') C.log(C.red(s))
    else if (log === 'info') C.info(s)
    return s
  },
  warn(sentence: string[] | string) {
    return this.say(sentence, { log: 'warning' })
  },
  info(sentence: string[] | string) {
    return this.say(sentence, { log: 'warning' })
  },
  tips(sentence: string[] | string) {
    return C.logClr(this.say('Tips: ' + sentence, { log: false }), [255, 105, 180])
  }
}