

import { TopkatUtilConfig } from 'topkat-utils/src/config'
import { ServiceClean } from './services.types'
import { Request, Response } from 'express'

//----------------------------------------
// GENERAL CONFIG
//----------------------------------------

export type GreenDotAppConfig = {
  name: string,
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
  apiKeys: {
    [apiKey in (GD['role'] | (string & {}))]?: {
      _id?: string
      token: string
      role?: GD['role']
      permissions?: Partial<Record<GD['permissions'], any>>
      // TODO
      /** Add IPs to whitelist, all other IPs will be non-authorized to authenticate with apiKey */
      ipWhitelist?: MaybeArray<string>
    } // /!\ Used in rest-test package
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
  * @example
  */
  connexionFn(defaultCtx: CtxUser, req: Request, res: Response): MaybePromise<CtxUser>
  publicFolder?: string
  corsOrigin: (RegExp | string)[] | ((origin: string) => boolean)

  serverCliIntro: string
  dataValidationConfig: Partial<TopkatUtilConfig>
  enableSchedules: boolean
  enableSeed: boolean
  defaultPaginationLimit?: number
  additionalServices?: Record<string, ServiceClean<any>>
  /** This will be executed periodically to get blacklist IPs from the application */
  beforeApiRequest?(ctx: Ctx, extraInfos: { discriminator: string, route: string }): any
  /** This will remove routes in autocomplete for tests */
  filterRoutesForTest?: (route: string) => boolean


  jwtSecret?: string
  jwtExpirationMs?: number
  jwtRefreshExpirationMsWeb?: number | 'never'
  jwtRefreshExpirationMsMobile?: number | 'never'


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
  }
}


interface ServerConfigGeneric {
  apiKeys: string
  models: string
}

declare global {
  interface ServerConfigCustom extends ServerConfigGeneric {
    // To be augmented in backend application
  }
}