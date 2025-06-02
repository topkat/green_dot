


import { GreenDotAppConfig, cliIntro } from 'green_dot'

import { ENV } from 'topkat-utils'

const {
  NODE_ENV = 'development',
  LIVE_URL,
  SERVER_PORT,
  JWT_SECRET = 'TODOreplaceThisStringWithYourTestSecret',
  IS_CRON_SERVER = false,
} = ENV()


const env: Env = NODE_ENV

const port = SERVER_PORT || 9086
const appName = 'mainBackend'
const version = '0.0.0'

const isProd = env === 'production' || env === 'preprod'

const liveUrl = typeof LIVE_URL === 'string' ? LIVE_URL.replace(/\/$/, '') : `http://localhost`
const appNameShort = appName.replace('bangk-', '').replace('-backend', '').toUpperCase()
const versionLine = appNameShort + ' '.repeat(30 - appNameShort.length - version.length) + version


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
  serverLiveUrl: liveUrl.includes('localhost') ? `${liveUrl}:${port}/` : liveUrl,
  emailFromAddress: 'no-reply@$$projectName.app',
  port,
  smtp: {}, // TODO add SMTP config here
  dataValidationConfig: {
    isProd,
    env,
    customTypes: {},
    terminal: {
      noColor: false,
      theme: {
        primary: [65, 117, 255], //
        shade1: [117, 155, 255],
      },
    },
  },
  jwtSecret: JWT_SECRET as string,
  jwtExpirationMs: refreshTokenExpirationMinutes * 60 * 1000,
  jwtRefreshExpirationMsMobile: 'never', // it will expire on new login // 48 * 3600 * 1000,
  jwtRefreshExpirationMsWeb: 'never', // it will expire on new login // 48 * 3600 * 1000,
  enableSchedules: env === 'production' || env === 'preprod' ? IS_CRON_SERVER : true,
  enableSeed: env === 'production' || env === 'preprod' ? IS_CRON_SERVER : true,
  additionalServices: { errorSimulator, rolesAttributionForTestOnly },
  plugins: [
    '$$pluginsAutocomplete'
  ]
}

export default appConfig

declare global {
  interface GD {
    // apiKeys: ApiKeys
  }
}


