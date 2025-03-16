import chokidar from 'chokidar'
import { C, cliLoadingSpinner, perfTimer, waitUntilTrue } from 'topkat-utils'
import { getProjectPaths } from '../helpers/getProjectPaths'
import { cleanCommand } from './clean.command'


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
    async step(title: string, callback: FunctionGeneric, { watch = false, cleanOnError = false } = {}) {

      const t2 = perfTimer()

      C.line(`${this._stepNb}) ${title}`, 50)

      try {
        await callback()
        C.log(C.dim(`\nStep ${this._stepNb} took ${t2.end()}`))
        this._stepNb++
      } catch (err) {
        C.error(err)
        C.error(false, `Step ${this._stepNb} ERROR`)
        if (watch) {
          const spin = new cliLoadingSpinner('dots')
          spin.start('Waiting for file change')

          const paths = await getProjectPaths()

          const w = chokidar
            .watch(paths.mainConfig.folderPath, {
              persistent: true, // Keep process alive
              ignored: [/node_modules/, /\/dist\//, /(^|[/\\])\..//* dot files */],
              ignoreInitial: true,
            })

          w.on('change', async () => {
            w.close()
            C.log(`\n\n`)
            if (cleanOnError) await cleanCommand()
            process.exit(1)
          })

          // wait forever just for it doesn't continue the script
          await waitUntilTrue(() => false, 0, false, false)

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