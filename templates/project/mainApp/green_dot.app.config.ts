


import { GreenDotAppConfig, cliIntro } from 'green_dot'
import greenDotConfig from '../green_dot.config'

import { ENV } from 'topkat-utils'

const {
  NODE_ENV = 'development',
  SERVER_PORT = 9086,
  LIVE_URL = `http://localhost:${SERVER_PORT}`,
  JWT_SECRET = 'TODOreplaceThisStringWithYourTestSecret',
  IS_CRON_SERVER = false,
  $$addToEnvVariableImports,
} = ENV()


const env: Env = NODE_ENV

// const port = SERVER_PORT || 9086

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
  jwtSecret: JWT_SECRET,
  jwtRefreshExpirationMsMobile: 'never', // it will expire on new login // 48 * 3600 * 1000,
  jwtRefreshExpirationMsWeb: 'never', // it will expire on new login // 48 * 3600 * 1000,
  enableSchedules: env === 'production' || env === 'preprod' ? IS_CRON_SERVER : true,
  enableSeed: env === 'production' || env === 'preprod' ? IS_CRON_SERVER : true,
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


