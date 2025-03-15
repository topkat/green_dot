

import { TopkatUtilConfig } from 'topkat-utils/src/config'
import { ServiceClean } from './services.types'
import { Request, Response } from 'express'

//----------------------------------------
// GENERAL CONFIG
//----------------------------------------

export type GreenDotAppConfig<
  RolesAll extends string = any,
  AllPermissions extends string = any
> = {
  name: string,
  /** Default process.env.NODE_ENV */
  env?: Env
  port: number
  serverLiveUrl: string
  emailFromAddress: string
  apiKeys: {
    [apiKey in (RolesAll | (string & {}))]?: {
      _id?: string
      token: string
      role?: RolesAll
      permissions?: Partial<Record<AllPermissions, any>>
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
  publicFolder?: string
  corsOrigin: (RegExp | string)[] | ((origin: string) => boolean)

  serverCliIntro: string
  dataValidationConfig: Partial<TopkatUtilConfig>
  enableSchedules: boolean
  enableSeed: boolean
  defaultPaginationLimit?: number
  additionalServices?: Record<string, ServiceClean<any>>
  /** This is where you put the logic when you want a custom authentication logic: */
  customLoginFn?(req: Request, res: Response): CtxUser
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