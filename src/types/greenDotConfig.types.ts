

import { GenerateSdkConfig } from './generateSdk.types'
import { MongoDbConfig } from './models.types'


//----------------------------------------
// GENERAL CONFIG
//----------------------------------------

export type GreenDotConfig<
  RolesAll extends string = any,
  AllPermissions extends string = any
> = {
  /** Default process.env.NODE_ENV */
  env?: Env
  /** This will be triggered before every api request */
  beforeApiRequest?(ctx: Ctx, extraInfos: { discriminator: string, route: string }): any
  //  ╔═╗  ╔══╗ ══╦══ ╔══╗ ╔═╗  ╔══╗ ╔═══ ╔══╗
  //  ║  ║ ╠══╣   ║   ╠══╣ ╠═╩╗ ╠══╣ ╚══╗ ╠═  
  //  ╚══╝ ╩  ╩   ╩   ╩  ╩ ╚══╝ ╩  ╩ ═══╝ ╚══╝
  database: {
    /** This is useful to provide a default database that will be exposed without databaseName prefix on SDK and $.db and to provide the database where green_dot will record models for technical purpose TODO add more details */
    defaultDatabaseName: string
    dbConfigs(): Promise<{
      /** Eg: bangk, roulette */
      [dbName: string]: {
        /** Eg: pizza-time...etc */
        [dbId: string]: MongoDbConfig
      }
    }>
  }
  //  ╔══╗ ╔══╗ ╦╗ ╔ ╦╗ ╔ ╔══╗ ═╗╔═ ═╦═ ╔══╗ ╦╗ ╔
  //  ║    ║  ║ ║╚╗║ ║╚╗║ ╠═    ╠╣   ║  ║  ║ ║╚╗║
  //  ╚══╝ ╚══╝ ╩ ╚╩ ╩ ╚╩ ╚══╝ ═╝╚═ ═╩═ ╚══╝ ╩ ╚╩
  connexion: {
    allRoles: readonly RolesAll[]
    /** In green_dot, every role represents a different UI (platform). So let's say you have a webapp and an admin dashboard, the object will be formatted as follow: `{ admin: 'adminSdk', user: 'appSdk' }`. */
    sdkNameForRole: { [role in RolesAll]: Ctx['platform'] }
    /** List all permissions that will be used in the app. Usually like `['hasPremiumMembership', 'hasVerifiedIdentity'...']`. Put here all permissions that may differentiate users on what they have access to  */
    allPermissions: readonly AllPermissions[]
    /** */
    defaultPermForAll?: Partial<Record<AllPermissions, boolean>>
    /** */
    defaultPermForRole?: Record<RolesAll, Partial<Record<AllPermissions, boolean>>>

    /** Giving a ctx, this function is meant to retrieve the user in the database. It just usually returns something like `await myDb.dbName.user.getById(ctx.GM, ctx._id, { triggerErrorIfNotSet: true })` and is used internally to provide ctx.getUser() shortcut (that will use cache if requested twice) */
    getUserFromCtx: (ctx: Ctx) => CtxUser

    customWarningAndBanFunctions?: {
      /** Provide a way to ban a user, for example when rate limiter in case you don't want it the default way...TODO TODO */
      banUser?(ctx: Ctx, extraInfos: { route?: string, discriminator: string }): MaybePromise<Record<string, any>>

      /** Use that if you want to blacklist IP in your database or lock the user for example, should return extraInfos to be sent alongside the error */
      addUserWarning?(ctx: Ctx, extraInfos: { route?: string, discriminator: string }): MaybePromise<{
        nbWarnings: number
        nbWarningLeftBeforeBan: 3
        /** /!\ THIS SHOULD BE USED only in a controlled environnement and will disable all rate limiter security */
        resetNbAttempts?: boolean
        IMPORTANT_MESSAGE?: string
      }>
    },
    //  ╔══╗ ╦    ╔══╗ ╔══╗ ══╦══ ╔═══
    //  ╠══╣ ║    ╠═   ╠═╦╝   ║   ╚══╗
    //  ╩  ╩ ╚══╝ ╚══╝ ╩ ╚    ╩   ═══╝
    alerts: {
      /** If this is set, errors will be sent on telegram chanel */
      telegram?: {
        botId: string,
        sendErrorChatIdsPerEnv: {
          [k in Env]?: number
        }
        sendOnErrorCode?(errCode: 200 | 422 | 403 | 401 | 404 | 500): boolean
      },
      /** If defined, this will notify on teams chanel 
        * * For Webhook Url, go to teams channel => open sidePanel => Manage chanel => connector => webhook => create
      */
      teams?: {
        /** TODO see */
        teamsWebhookUrl: string
      }
    }
    /** Configure how the SDK are generated */
    sdkConfig?: GenerateSdkConfig
  }

}