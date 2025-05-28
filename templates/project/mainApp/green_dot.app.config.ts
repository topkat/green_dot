

import { GreenDotAppConfig, cliIntro } from 'green_dot'
import { errorSimulator, rolesAttributionForTestOnly } from '../shared/apiServices/apiServices'
import { getApiKeys } from './1_shared/configs/api-keys'

import { ENV } from 'topkat-utils'

const {
  NODE_ENV = 'development',
  LIVE_URL,
  SERVER_PORT,
  JWT_SECRET = 'saluLaTimDéOditeurKojisséoSiVouTrouvaiSaVouAvéGanié',
  IS_CRON_SERVER = false,
} = ENV()

//  ╦  ╦ ╔══╗ ╔══╗ ═══╗   ╔═══ ╔══╗ ══╦══ ╦  ╦ ╔══╗
//  ╚╗ ║ ╠══╣ ╠═╦╝ ╔══╝   ╚══╗ ╠═     ║   ║  ║ ╠══╝
//   ╚═╝ ╩  ╩ ╩ ╚  ╚═══   ═══╝ ╚══╝   ╩   ╚══╝ ╩

const env: Env = NODE_ENV

const port = SERVER_PORT || 9086
const version = '0.0.0'

const isProd = env === 'production' || env === 'preprod'

const liveUrl = typeof LIVE_URL === 'string' ? LIVE_URL.replace(/\/$/, '') : `http://localhost`

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
  port,
  serverLiveUrl: liveUrl.includes('localhost') ? `${liveUrl}:${port}/` : liveUrl,
  emailFromAddress: 'no-reply@$$projectName.app',
  smtp: env === 'test' ? {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: true,
    auth: {
      user: 'f52e1833bb79f0',
      pass: 'e4bb3959ae93b5'
    }
  } : env !== 'production' ? {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ron11@ethereal.email',
      pass: 'YzZz7FwGRvDwN3CNxW'
    }
  } : {},
  dataValidationConfig: {
    isProd,
    env,
    terminal: {
      noColor: false,
      theme: {
        primary: [65, 117, 255], //
        shade1: [117, 155, 255],
      },
    },
  },
  jwtSecret: JWT_SECRET as string,
  jwtExpirationMs: 15 * 60 * 1000,
  jwtRefreshExpirationMsMobile: 'never', // it will expire on new login // 48 * 3600 * 1000,
  jwtRefreshExpirationMsWeb: 'never', // it will expire on new login // 48 * 3600 * 1000,
  enableSchedules: env === 'production' || env === 'preprod' ? IS_CRON_SERVER : true,
  enableSeed: env === 'production' || env === 'preprod' ? IS_CRON_SERVER : true,
  apiKeys: getApiKeys(),
  plugins: [
    '$$pluginsAutocomplete'
  ]
}

export default appConfig