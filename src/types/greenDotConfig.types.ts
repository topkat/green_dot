
import 'typescript-generic-types'
import { GenerateSdkConfig } from './generateSdk.types'


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
  /** The default database contains User model as well as different technical fields for security. It will also be exposed more concisely compared to other databases when possible */
  defaultDatabaseName: string
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
    getUserFromCtx?: (ctx: Ctx) => CtxUser

    // /!\ IMPORTANT, this is in a subObject since banUser and addWarning shoud be provided together
    /** Use this to override ban user and addUserWarning behavior. Warning and ban will happen when rate limiter is triggered or whan you call it manually with ctx.addUserWarning() or ctx.banUser(), so you have full control over it */
    customWarningAndBanUserConfig?: {
      // TODO
      /** Default: 3; Determines how much warnings it takes for a user to be banned */
      nbWarningsBeforeBan?: number
      /** interval in milliseconds to which the database should be checked to unblacklist users. Default: ```env === 'test' ? 1000 : 3 * 60 * 1000``` */
      blackListCheckInterval?: number,
      /** This is an array of user blacklist duration. Default: ```[15, 120, 12 * 60]```. In this case the user will be banned 15 minutes the first time he is banned, then 120 minutes the second time and 12h the third time. Timer will reset at a certian interval (which ? TODO) */
      blackListBanMinutes?: number[],

      /** Provide a way to ban a user, for example when rate limiter in case you don't want it the default way...TODO TODO */
      banUser(ctx: Ctx, extraInfos: { route?: string, discriminator: string }): MaybePromise<Record<string, any>>

      /** Use that if you want to blacklist IP in your database or lock the user for example, should return extraInfos to be sent alongside the error */
      addUserWarning(ctx: Ctx, extraInfos: { route?: string, discriminator: string }): MaybePromise<{
        nbWarnings: number
        nbWarningLeftBeforeBan: 3
        /** /!\ THIS SHOULD BE USED only in a controlled environnement and will disable all rate limiter security */
        resetNbAttempts?: boolean
        IMPORTANT_MESSAGE?: string
      }>
    }

    //  ╔══╗ ╦    ╔══╗ ╔══╗ ══╦══ ╔═══
    //  ╠══╣ ║    ╠═   ╠═╦╝   ║   ╚══╗
    //  ╩  ╩ ╚══╝ ╚══╝ ╩ ╚    ╩   ═══╝
    alerts?: {
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





type RequiredFields = {
  env: true
  'connexion.customWarningAndBanUserConfig': true
  'connexion.customWarningAndBanUserConfig.nbWarningsBeforeBan': true
  'connexion.customWarningAndBanUserConfig.blackListCheckInterval': true
  'connexion.customWarningAndBanUserConfig.blackListBanMinutes': true
}





export type GreenDotConfigWithDefaults = AddRequiredFieldsToObject<GreenDotConfig, RequiredFields>




export const greenDotConfigDefaults = {
  env: process.env.NODE_ENV as Env,
  connexion: {
    customWarningAndBanUserConfig: {
      blackListBanMinutes: [15, 120, 12 * 60],
      blackListCheckInterval: process.env.NODE_ENV === 'test' ? 1000 : 3 * 60 * 1000,
      nbWarningsBeforeBan: 3,
    }
  }

} satisfies AddRequiredFieldsToObject<RecursivePartial<GreenDotConfig>, RequiredFields>