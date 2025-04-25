
import { C, cliLoadingSpinner, perfTimer } from 'topkat-utils'
import { cleanCommand } from '../clean.command'
import { onFileChange } from '../helpers/fileWatcher'
import { terminalCharSize } from '../helpers/cli'


/** This will start a task, measure performances as well as cut build into steps for easier debugging, performance tracking and better user logs
@example ``` typescript
const build = createNewBuild()

await build.step('Msg description', () => buildStepCallback())
await build.step('Msg description 2', () => buildStepCallback2())

build.end('Successfully built') // in N seconds will be appended to description
```
 */
export function createNewTask() {
  const time = perfTimer()
  return {
    _stepNb: 1,
    _startTime: Date.now(),
    async step(title: string, callback: FunctionGeneric, { watch = false, cleanOnError = false, doNotDisplayTime = false } = {}) {

      const t2 = perfTimer()

      C.line(`${this._stepNb}) ${title}`, terminalCharSize)

      try {
        await callback()
        if (!doNotDisplayTime) C.log(C.dim(`\nStep ${this._stepNb} took ${t2.end()}`))
        this._stepNb++
      } catch (err) {
        C.error(err)
        C.error(false, `Step ${this._stepNb} ERROR`)
        if (watch) {
          const spin = new cliLoadingSpinner('dots')
          spin.start('Waiting for file change')

          await onFileChange(async () => {
            C.log(`\n\n`)
            if (cleanOnError) await cleanCommand()
            process.exit(1)
          }, { autoClose: true })
        } else {
          throw err
        }
      }
    },
    end(text: string) {
      C.success(`${text} in ${time.end()}`)
    }
  }
}