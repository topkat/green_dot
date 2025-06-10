
import fs from 'fs-extra'
import { C, objEntries, pad } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot.js'
import { notImplementedWarning } from '../helpers/notImplementedWarning.js'

const periods = {
  minute: { label: 'Every minute', labelForEvery: 'minute' },
  hourly: { label: 'Hourly', labelForEvery: 'hour' },
  daily: { label: 'Daily', labelForEvery: 'day' },
  weekly: { label: 'Weekly', labelForEvery: 'week' },
  monthly: { label: 'Monthly', labelForEvery: 'month' },
}


type Period = keyof typeof periods


export async function cliGenerateHook(fileName: string, filePath: string) {

  if (fileName !== 'contributeplz') return notImplementedWarning()

  //   const period = await luigi.askSelection(
  //     `Period for the schedule?`,
  //     objEntries(periods).map(([k, v]) => ({ value: k, name: v.label }))
  //   )

  //   let minute = 0
  //   let hour = 0
  //   if (period === 'hourly') {
  //     minute = await luigi.askNumberInput(
  //       `At which minute should we start the schedule ?`,
  //       { min: 0, max: 60 }
  //     )
  //   } else if (period !== 'minute') {
  //     hour = await luigi.askNumberInput(
  //       `At which hour should we start the schedule (24h base) ?`,
  //       { min: 0, max: 24 }
  //     )
  //   }

  //   const cronString = cronGenerator(period, hour, minute)

  //   const scheduleFileTemplate = `
  // import { db, schedule } from 'green_dot'

  // export const ${fileName}Schedule = schedule({
  //     schedule: {
  //         frequency: '${cronString}', // Every ${periods[period].labelForEvery} at ${pad(hour)}:${pad(minute)}
  //         // frequencyDevEnv: 'server.start',
  //     },
  //     async main(ctx) {

  //     },
  // })
  // `
  //   await fs.outputFile(filePath, scheduleFileTemplate, 'utf-8')

}