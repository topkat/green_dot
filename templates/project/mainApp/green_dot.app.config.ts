


import { GreenDotAppConfig, cliIntro, env } from 'green_dot'

import { ENV } from 'topkat-utils'

const {
  SERVER_PORT = 9086,
  LIVE_URL = `http://localhost:${SERVER_PORT}`,
  IS_CRON_SERVER = false,
  $$addToEnvVariableImports,
} = ENV()

const version = '0.0.0'


export const appConfig: GreenDotAppConfig = {
  name: 'main',
  serverCliIntro: cliIntro('$$projectName', version),
  corsOrigin: origin => {
    // TODO configure CORS security here
    return true
  },
  swaggerDoc: {
    enable: true,
  },
  serverLiveUrl: LIVE_URL,
  emailFromAddress: 'no-reply@$$projectName.app',
  port: SERVER_PORT,
  smtp: {}, // TODO add SMTP config here
  enableSchedules: env.isProd ? IS_CRON_SERVER : true,
  enableSeed: env.isProd === 'production' || env === 'preprod' ? IS_CRON_SERVER : true,
  plugins: [
    '$$pluginsAutocomplete'
  ]
}

export default appConfig

declare global {
  interface GD {
    $$addToGlobalType
  }
}


