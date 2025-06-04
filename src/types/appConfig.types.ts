

import { ServiceClean } from './services.types'
import { Request, Response } from 'express'
import { InstanciatedPlugin } from '../plugins/pluginSystem'
import { Color } from 'topkat-utils/src/types'
import { RateLimiterConfig } from '../security/serviceRouteRateLimiter'

//----------------------------------------
// GENERAL CONFIG
//----------------------------------------

export type GreenDotAppConfig = {
  name: string,
  version?: string,
  /** Default process.env.NODE_ENV */
  env?: Env
  port: number
  serverLiveUrl: string
  emailFromAddress: string
  swaggerDoc: {
    enable: boolean
    descriptionText?: string
    serversUrl?: string[]
    /** If you want to have generated json doc version somewhere on your repo */
    copyDocJsonToFolder?: string
  }
  smtp: {
    host?: string
    port?: number
    secure?: boolean
    auth?: {
      user?: string
      pass?: string
    }
  }
  /** This is where you connect and give role and permissions to enter your app. This is usually where you read apiKeys or JWT Tokens to ensure users have the right to connect. Note: you can add props to Ctx (Eg: ctx.companyId...) and augment type to reflect your new field. See Ctx augmentation doc (TODO)
  * @example TODO
  */
  onLoginCallback?(defaultCtx: CtxUser, req: Request, res: Response)
  // publicFolder?: string
  corsOrigin: (RegExp | string)[] | ((origin: string) => boolean)
  /** A string to be used as an intro for the cli server start process OR a function where you handle console log yourself */
  cliIntro?: string | (() => any)
  disableTerminalColors?: boolean
  terminalColor1?: Color
  terminalColor2?: Color
  enableSchedules: boolean
  enableSeed: boolean
  defaultPaginationLimit?: number
  additionalServices?: Record<string, ServiceClean<any>>
  /** This will be executed periodically to get blacklist IPs from the application */
  beforeApiRequest?(ctx: Ctx, extraInfos: { discriminator: string, route: string }): any
  /** This will remove routes in autocomplete for tests */
  filterRoutesForTest?: (route: string) => boolean


  /** Default: true. RateLimiter is a security feature that prevent user to exploit
   the server by doing a very big amount of request in a very short
   time (Eg: DDoS attack...). It will use a discriminator (userId if
   connected or IP adresse if not) and add a warning each time the
   rateLimiter is triggered according to the settings you set. After
   the configured nbWarningBeforeBan, the user will be banned for a
   short amount of time, and if it is banned again, this time will be
   greater. The limit will reset with a certain amount of time.
   * You can configure rateLimiter per routes in a service (this fine tuning is very useful)
   * * **NOTE**: if you work with KUBERNETES or distributed environement, you have to make sure IP adress are always assigned to the same pods, if not the rateLimiter will not work as expected.
   */
  enableRateLimiter?: boolean

  /** Default is '50/30s' => 50 apiCall for a 30 sec time window for a single user (IP or userId if possible) OR '200/30sec' for isTest env */
  defaultRateLimit?: RateLimiterConfig

  /** Default: true. Warnings are set manually via ctx.addWarning() or by the system
  (rateLimiter...). After the configured nbWarningBeforeBan, the user will
  be banned for a short amount of time, and if it is banned again, this
  time will be greater. The limit will reset with a certain amount of time.
  */
  enableUserWarnings?: boolean
  /** Default: true. You can ban manually a user via ctx.banUser() or it can be banned after
  receivving a certain amount of warnings, whenever manually via ctx.addWarning()
  or by the system if configured (rateLimiter...)
  */
  enableUserBan?: boolean
  /** Default: 3; Determines how much warnings it takes for a user to be banned */
  nbWarningsBeforeBan?: number
  /** interval in milliseconds to which the database should be checked to unblacklist users. Default: ```env === 'test' ? 1000 : 3 * 60 * 1000``` */
  blackListCheckInterval?: number,
  /** This is an array of user blacklist duration. Default: ```[15, 120, 12 * 60]```. In this case the user will be banned 15 minutes the first time he is banned, then 120 minutes the second time and 12h the third time. Timer will reset at a certian interval (which ? TODO) */
  blackListBanMinutes?: number[],
  /** Green dot will expose a ensureUserIsNotLocked() and lockUserAndThrow() so you can lock the user if needed. This configure the time  */
  lockDurationMinutes?: number


  //  ╔══╗ ╦    ╔══╗ ╔══╗ ══╦══ ╔═══
  //  ╠══╣ ║    ╠═   ╠═╦╝   ║   ╚══╗
  //  ╩  ╩ ╚══╝ ╚══╝ ╩ ╚    ╩   ═══╝
  alerts?: {
    /** If this is set, errors will be sent to the configured telegram chanel by botId */
    telegram?: {
      enable: boolean
      /** todo explain how to do here */
      botId: string
      /** Same here todo */
      chatId: number
      /** By default it only sends error on code 500 (server error) */
      sendOnErrorCode?(errCode: 200 | 422 | 403 | 401 | 404 | 500): boolean
    },
    /** If defined, this will notify on teams chanel
      * * For Webhook Url, go to teams channel => open sidePanel => Manage chanel => connector => webhook => create
    */
    teams?: {
      enable: boolean
      /** TODO see */
      teamsWebhookUrl: string
    }
  },

  /**
  @example
  * ```
    import {MyPlugin} from 'green_dot/plugins'
    const greenDotConfig = {
        ...
        plugins: [new MyPlugin({ enable: true, ...pluginConfig })]
        ...
    }
  * ```
   */
  plugins?: InstanciatedPlugin[]
}