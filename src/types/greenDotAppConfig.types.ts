

import { GenerateSdkConfig } from './generateSdk.types'
import { TopkatUtilConfig } from 'topkat-utils/src/config'
import { MongoDbConfig } from './models.types'
import { ServiceClean } from './services.types'

//----------------------------------------
// GENERAL CONFIG
//----------------------------------------

export type GreenDotAppConfig<
  RolesAll extends string = any,
  AllPermissions extends string = any
> = {
  env: Env
  // appName: string APP NAME SHOULD BE DERIVED FROM FOLDER NAME or have a default name if only one app.config is found in parent repo ?
  port: number
  serverLiveUrl: string
  // rootPath: string
  emailFromAddress: string
  // allRoles: readonly RolesAll[]
  // platformForPermission: { [role in RolesAll]: Ctx['platform'] }
  // allPermissions: readonly AllPermissions[]
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
  // getUserFromCtx: (ctx: Ctx) => Promise<Record<string, any>>
  defaultPaginationLimit?: number
  // defaultDatabase?: string
  // notifyOnErrorOnTeamsChannel?: string
  additionalServices?: Record<string, ServiceClean<any>>
  // swaggerDocObject?: Record<string, any>
  // telegramConfig?: {
  //   botId: string,
  //   sendErrorChatIdsPerEnv: {
  //     [k in Env]?: number
  //   }
  //   sendOnErrorCode?(errCode: 200 | 422 | 403 | 401 | 404 | 500): boolean
  // }
  /** This will be executed periodically to get blacklist IPs from the application */
  beforeApiRequest?(ctx: Ctx, extraInfos: { discriminator: string, route: string }): any
  banUser?(ctx: Ctx, extraInfos: { route?: string, discriminator: string }): MaybePromise<Record<string, any>>
  /** Use that if you want to blacklist IP in your database or lock the user for example, should return extraInfos to be sent alongside the error */
  addUserWarning?(ctx: Ctx, extraInfos: { route?: string, discriminator: string }): MaybePromise<{
    nbWarnings: number
    nbWarningLeftBeforeBan: 3
    /** /!\ THIS SHOULD BE USED only in a controlled environnement and will disable all rate limiter security */
    resetNbAttempts?: boolean
    IMPORTANT_MESSAGE?: string
  }>
  dbConfigs(): Promise<{
    /** Eg: bangk, roulette */
    [dbName: string]: {
      /** Eg: pizza-time...etc */
      [dbId: string]: MongoDbConfig
    }
  }>
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