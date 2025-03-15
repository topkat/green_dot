import { C, perfTimer } from 'topkat-utils'


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
    async step(title: string, callback: FunctionGeneric) {
      const t2 = perfTimer()
      C.line(`${this._stepNb}) ${title}`, 50)
      try {
        await callback()
        C.log(C.dim(`\nStep 2 took ${t2.end()}`))
        this._stepNb++
      } catch (err) {
        C.error(false, `Step ${this._stepNb} ERROR`)
        throw err
      }
    },
    end(text: string) {
      C.success(`${text} in ${time.end()}`)
    }
  }
}