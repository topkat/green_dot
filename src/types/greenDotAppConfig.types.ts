

import { TopkatUtilConfig } from 'topkat-utils/src/config'
import { ServiceClean } from './services.types'

//----------------------------------------
// GENERAL CONFIG
//----------------------------------------

export type GreenDotAppConfig<
  RolesAll extends string = any,
  AllPermissions extends string = any
> = {
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
  /** This will be executed periodically to get blacklist IPs from the application */
  beforeApiRequest?(ctx: Ctx, extraInfos: { discriminator: string, route: string }): any
  awsConfig?: {
    accessKeyId: string
    secretAccessKey: string
    region: 'eu-west-1'
  }
  /** This will remove routes in autocomplete for tests */
  filterRoutesForTest?: (route: string) => boolean


  jwtSecret?: string
  jwtExpirationMs?: number
  jwtRefreshExpirationMsWeb?: number | 'never'
  jwtRefreshExpirationMsMobile?: number | 'never'
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