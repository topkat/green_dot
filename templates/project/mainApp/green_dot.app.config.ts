

import { refreshTokenExpirationMinutes } from '../shared/constants/generic.constants'

import { GreenDotAppConfig } from 'green_dot'
import { errorSimulator, rolesAttributionForTestOnly } from '../shared/apiServices/apiServices'
import { getApiKeys } from './1_shared/configs/api-keys'
import { loginHook } from './1_shared/hooks/on-login-hook'


import { ENV } from 'topkat-utils'
import { UserNames } from './1_shared/tests/testUsers'
import { TestEnvUser } from './1_shared/tests/testEnv.type'

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

const letterLogo = `
    "$$$_      $$$$$$$$$$$_
      "$$$_    $$$      "$$$
        "$$$_  $$$       $$$
          "$$$_$$$______$$"
          _$$$"$$$"""""""$$_
        _$$$"  $$$        $$$
      _$$$"    $$$       _$$$
    _$$$"      $$$$$$$$$$$$"



 $$$$_  _$$_  $$   $  _$$$_  $  _$
 $   $  $  $  $$$  $ $    "  $_$"
 $$$$_ _$  $_ $ $$ $ $  $$$  $
 $   $ $    $ $  $$$ $    $  $"$_
 $$$$" $    $ $   $$  "$$$$  $  "$
`


// initDbCache(bangkDbIds, websiteDbIds, adminDbIds)

const env: Env = NODE_ENV

const devUrls = /https?:\/\/[^.]*.?15\.237\.144\.193/
const localHostRegexp = /https?:\/\/[^.]*.?localhost/
const officialUrl = /https?:\/\/[^.]*.?bangk.app/
const shuftiProPregexp = /https?:\/\/[^/]*shuftipro.com/

const port = SERVER_PORT || 9086
const appName = 'mainBackend'
const version = '0.0.0'

const isProd = env === 'production' || env === 'preprod'

const liveUrl = typeof LIVE_URL === 'string' ? LIVE_URL.replace(/\/$/, '') : `http://localhost`
const appNameShort = appName.replace('bangk-', '').replace('-backend', '').toUpperCase()
const versionLine = appNameShort + ' '.repeat(30 - appNameShort.length - version.length) + version


export const appConfig: GreenDotAppConfig = {
  name: 'main',
  serverCliIntro: letterLogo +
    `\n${versionLine}`,
  corsOrigin: origin => {
    if (env === 'development') {
      return officialUrl.test(origin) || localHostRegexp.test(origin) || devUrls.test(origin)
    } else if ((env === 'production' || env === 'preprod')) {
      return officialUrl.test(origin) || shuftiProPregexp.test(origin) || devUrls.test(origin)
    } else return true
  },
  swaggerDoc: {
    enable: true,
  },
  // dbConfigs: async () => await initDbs(initWebsiteDb, initDb, initAdminDb),
  port,
  serverLiveUrl: liveUrl.includes('localhost') ? `${liveUrl}:${port}/` : liveUrl,
  emailFromAddress: 'no-reply@bangk.app',
  // TODO
  // plugins: [
  //   greenDotAuth.jwt('user'),
  //   greenDotAuth.githubAuth('user'),
  // ],
  connexionFn: loginHook,
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
  apiKeys: getApiKeys(),
  additionalServices: { errorSimulator, rolesAttributionForTestOnly },
}

export default appConfig


//----------------------------------------------------------
//
//            GLOBAL TYPES
//
// Those global types are exposed so you can override them
// with your custom functions or props
//----------------------------------------------------------

declare global {

  /** env variable type that is used in API tests ('.testSuite.ts' files). You can also override env type per test suite instead of globally in a type param (see generated file comments or documentation for advanced use cases TODO document me) */
  interface TestEnv {
    lastConnectedUser: string
    /** Populated in sellOffer test suite */
    investmentProjectId: string
    users: Record<UserNames, TestEnvUser>
  }
}