import { input, select, checkbox, confirm, search, number, Separator } from '@inquirer/prompts'
import { asArray, C, randomItemInArray } from 'topkat-utils'
import { wrapCliText, terminalCharSize } from './cli'
import { openInDefaultEditor } from './openInDefaultEditor'

export const luigi = {
  greet() {
    C.log('\n')
    this.say([
      'Greetings, carbon-based entity! Awaiting instructions',
      'System online. Boot sequence complete. What’s the mission?',
      'Welcome on board capitain!',
      'What can I do for you today?',
      'Hey, what\'s up?', 'Blip...bloup...bip..bip.........',
      'Master the CLI you must, young Padawan'
    ])
    C.log('\n')
  },
  confirm() {
    C.log('\n')
    this.say([
      'Perfecto 👌',
      'Tutto bene 👌',
      'Sure thing!',
      'This is the way 🥷',
      'Roger that! Executing…',
      'Confirmed. The timeline remains intact... for now',
    ])
    C.log('\n')
  },
  success(msg: string) {
    this.say(msg, { log: 'success' })
  },
  // messages: {
  //   serverStarted() {
  //     say([
  //       `Allocating 42 units of startup energy… Ready!`
  //     ])
  //   }
  // },
  async askUserInput(
    message: string,
    conf?: Omit<Parameters<typeof input>[0], 'message'>
  ) {
    C.log('\n')
    return await input({
      message: this.say(message, { log: false }),
      ...(conf || {}),
    })
  },
  async askNumberInput(
    message: string,
    conf?: Omit<Parameters<typeof number>[0], 'message'>
  ) {
    C.log('\n')
    return await number({
      message: this.say(message, { log: false }),
      ...(conf || {}),
    })
  },
  async askConfirmation(
    message: string
  ) {
    C.log('\n')
    return await confirm({
      message: this.say(message, { log: false }),
    })
  },
  async askSelection<V extends string | { name?: string, value: any, description?: string, checked?: boolean }, C extends Omit<Parameters<typeof select>[0], 'message' | 'choices'> & { multi?: boolean }>(
    msg: string | string[],
    choices: readonly (V | Separator)[],
    config: C = { multi: false } as C
  ): Promise<C extends { multi: true } ? (V extends { value: any } ? V['value'] : V)[] : V extends { value: any } ? V['value'] : V> {
    C.log('\n')
    const { multi = false } = config

    return await (multi ? checkbox : select)({
      message: luigi.say(msg, { log: false }),
      choices: choices as any,
      loop: false,
      pageSize: 15,
      ...config,
    } as any) as any
  },
  async autoComplete<T extends Parameters<typeof search>[0]['source']>(
    msg: string | string[],
    searchFn: T,
    config?: Omit<Parameters<typeof search>[0], 'source'>
  ): Promise<string> { //Awaited<ReturnType<T>>[number]
    C.log('\n')
    return await search({
      message: luigi.say(msg, { log: false }),
      source: searchFn,
      pageSize: 15,
      ...config,
    } as any) as any
  },
  say(
    sentence: string[] | string,
    { log = 'log', noWrap = false }: {
      log?: false | 'log' | 'warning' | 'error' | 'info' | 'success'
      noWrap?: boolean
    } = {},
  ) {
    let lines: string
    if (noWrap) lines = randomItemInArray(asArray(sentence))
    else lines = wrapCliText(randomItemInArray(asArray(sentence)), terminalCharSize - 7).join('\n     ')
    const s = '🤖 < ' + lines + '\n\n'
    if (log !== false) C.log('\n')
    if (log === 'log') C.log(s)
    else if (log === 'warning') C.logClr(s, [255, 122, 0])
    else if (log === 'error') C.log(C.red(s))
    else if (log === 'info') C.info(s)
    else if (log === 'success') C.success(s)
    return s
  },
  warn(sentence: string[] | string) {
    C.log('\n')
    this.say(sentence, { log: 'warning' })
    C.log('\n')
  },
  info(sentence: string[] | string) {
    C.log('\n')
    this.say(sentence, { log: 'info' })
    C.log('\n')
  },
  tips(sentence: string[] | string) {
    C.log('\n\n')
    return C.logClr(this.say('Tips: ' + sentence, { log: false }), [255, 105, 180])
  },
  separator(txt?: string) {
    return new Separator(txt)
  },
  async openFile(absolutePath: string, silent = false) {
    await openInDefaultEditor(absolutePath, silent)
  }
}