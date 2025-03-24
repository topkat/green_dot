
import fs from 'fs-extra'
import { C, objKeys, pad } from 'topkat-utils'
import { luigi } from '../helpers/luigi.bot'


const periods = {
  minute: { label: 'Every minute', labelForEvery: 'minute' },
  hourly: { label: 'Hourly', labelForEvery: 'hour' },
  daily: { label: 'Daily', labelForEvery: 'day' },
  weekly: { label: 'Weekly', labelForEvery: 'week' },
  monthly: { label: 'Monthly', labelForEvery: 'month' },
}


type Period = keyof typeof periods


export async function cliGenerateSchedule(fileName: string, filePathWithoutExt: string) {

  const period = await luigi.askSelection(
    `Period for the schedule?`,
    objKeys(periods)
  )

  let minute = 0
  let hour = 0
  if (period === 'hourly') {
    minute = await luigi.askNumberInput(
      `At which minute should we start the schedule ?`,
      { min: 0, max: 60 }
    )
  } else if (period !== 'minute') {
    hour = await luigi.askNumberInput(
      `At which hour should we start the schedule (24h base) ?`,
      { min: 0, max: 24 }
    )
  }

  const cronString = cronGenerator(period, hour, minute)

  const scheduleFileTemplate = `
import { db, schedule } from 'green_dot'

export const ${fileName}Schedule = schedule({
    schedule: {
        frequency: '${cronString}', // Every ${periods[period].labelForEvery} at ${pad(hour)}:${pad(minute)}
        // frequencyDevEnv: 'server.start',
    },
    async main(ctx) {
        
    },
})
`
  await fs.outputFile(filePathWithoutExt, scheduleFileTemplate, 'utf-8')

}





function cronGenerator(period: Period, hour: number, minute: number) {
  switch (period) {
    case 'minute':
      return `* * * * *`
    case 'hourly':
      return `${minute} * * * *`
    case 'daily':
      return `${minute} ${hour} * * *`
    case 'weekly':
      return `${minute} ${hour} * * 0`
    case 'monthly':
      return `${minute} ${hour} 1 * *`
    default:
      throw C.error('Invalid period. Choose from: minute, hourly, daily, weekly, monthly.')
  }
}