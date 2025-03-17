import { cliPrompt } from 'simple-cli-prompt'
import { asArray, C, randomItemInArray } from 'topkat-utils'

type CliPromptOptions = {
  choices: string[] | readonly string[]
  message?: string | string[]
}


export const nestor = {
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
      message: this.say(message, false),
      confirm: true,
    })
  },
  async askSelection<T extends CliPromptOptions>(
    config: T
  ): Promise<T['choices'][number]> {
    return await cliPrompt({
      message: config.message ? this.say(config.message, false) : undefined,
      choices: config.choices
    })
  },
  say(sentence: string[] | string, log = true) {
    const s = '\n🤖 < ' + randomItemInArray(asArray(sentence)) + '\n\n'
    if (log) C.log(s)
    return s
  }
}