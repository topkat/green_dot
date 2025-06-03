
import 'typescript-generic-types'
import { GenerateSdkConfig } from './generateSdk.types'
import { generateSdkConfigDefault } from '../generate/generateSDK/generateSDKconfigShared'
import { RateLimiterConfig, RateLimiterStr } from '../security/serviceRouteRateLimiter'
import { AutoIndexFileConfig } from '../services/autoIndex'

export type GreenDotConfigRateLimiterInfos = { route?: string, discriminator: string }

//----------------------------------------
// GENERAL CONFIG
//----------------------------------------

export type GreenDotConfig = {
  /** Default process.env.NODE_ENV */
  env: string
  /** Determine if we should consider being in PRODUCTION mode, you can get that value in your code with getEnv(). We can not always determine if we are in production just with env variable (Eg: production, beta, preprod...) so you have to do it manually */
  isProdEnv: boolean
  /** Determine if we should consider being in TEST mode, you can get that value in your code with getEnv().We can not always determine if we are in test just with env variable (Eg: test, ci...) so you have to do it manually */
  isTestEnv: boolean
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
  allRoles: readonly GD['role'][]
  /** List all permissions that will be used in the app. Usually like `['hasPremiumMembership', 'hasVerifiedIdentity'...']`. Put here all permissions that may differentiate users on what they have access to  */
  allPermissions: readonly GD['permission'][]
  /** Permissions restrictions that apply to all users. Eg: `isLocked: false` is considered mandatory for all users to connect
  * @example
  *```ts
  * {
  *   isLocked: false,
  *   isDeleted: false,
  *   hasAgreedWithTermsAndConditions: true,
  * }
  * ```
  */
  defaultPermRestrictionForAll: Partial<Record<GD['permission'], boolean>>
  /** Permissions restrictions that apply to users with role. Eg: Let's say that by default you want all users to be `isEmailVerified: true`. This is where you set it
  * @example
  *```ts
  * {
  *   appUser: { isEmailVerified: true },
  *   admin: {},
  * }
  * ```
  */
  defaultPermRestrictionForRole: Partial<Record<GD['role'], Partial<Record<GD['permission'], boolean>>>>

  /** Giving a ctx, this function is meant to retrieve the user in the database. It just usually returns something like `await myDb.dbName.user.getById(ctx.GM, ctx._id, { triggerErrorIfNotSet: true })` and is used internally to provide ctx.getUser() shortcut (that will use cache if requested twice) */
  getUserFromCtx?: (ctx: Ctx) => CtxUser

  /** If you want to define your own custom regexp for email validation. Default at least 1 upperCase, 1 lowerCase, 1 digit => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).*$/. Leng */
  emailRegexp?: RegExp,
  userLockReasons?: readonly string[] | string[],

  // /!\ IMPORTANT, this is in a subObject since banUser and addWarning shoud be provided together
  /** Use this to override ban user and addUserWarning behavior. Warning and ban will happen when rate limiter is triggered or whan you call it manually with ctx.addUserWarning() or ctx.banUser(), so you have full control over it */
  customWarningAndBanUserFunctions?: {
    /** This function will be called when the code request to banUser(). It will override the default green_dot behavior. Provide a way to ban a user, for example when rate limiter in case you don't want it the default way...TODO TODO */
    banUser(ctx: Ctx, extraInfos: GreenDotConfigRateLimiterInfos): MaybePromise<Record<string, any>>

    /** This function will be called when the code request a addUserWarning. It will override the default green_dot behavior. Use that if you want to blacklist IP in your database or lock the user for example, should return extraInfos to be sent alongside the error */
    addUserWarning(ctx: Ctx, extraInfos: GreenDotConfigRateLimiterInfos): MaybePromise<{
      nbWarnings: number
      nbWarningLeftBeforeBan: number
    }>
  }
  //  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ╔══╗ ══╦══ ╔══╗
  //  ║ ═╦ ╠═   ║╚╗║ ╠═   ╠═╦╝ ╠══╣   ║   ╠═
  //  ╚══╝ ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚  ╩  ╩   ╩   ╚══╝
  /** Configure how the SDK are generated */
  generateSdkConfig: GenerateSdkConfig

  /** Generate Command Options */
  generateCommandOptions?: Partial<{
    apiServiceDefaultOptions?: {
      /** TODO generate jsDoc on your SDK as well as on swagger documentation...etc
      * * 'simple': a simple line string
      * * 'extended': a string and an array of thrown errors to be documented */
      docStyle: 'none' | 'simple' | 'extended',
      /** TODO document this */
      rateLimiter: RateLimiterStr
      /** By default, Api route is inferred from the service name. So if you service
      * is called subscribeNewsletter, the route will be
      * 'http://my.api/subscribe-newsletter'.
      * Use this if you want custom route. */
      displayApiRouteField: boolean
      /** By default all api methods (GET, POST...) in green_dot are POST for simplicity
      * if you want to expose your route with another method, this is the way to go.
      * You can get req in ctx.api.req, for exemple for queryString ctx.api.req.query */
      displayApiMethodField: boolean
    }
  }>
  /** Auto generated index files for a given folder and a give file match. Will be generated at build time. */
  autoIndexes?: AutoIndexFileConfig[]
}





type RequiredFields = {
  env: true
  'nbWarningsBeforeBan': true
  'blackListCheckInterval': true
  'blackListBanMinutes': true
}





export type GreenDotConfigWithDefaults = AddRequiredFieldsToObject<GreenDotConfig, RequiredFields> & { platforms: string[] }




export const greenDotConfigDefaults = {
  env: process.env.NODE_ENV as Env,
  generateSdkConfig: generateSdkConfigDefault
} satisfies AddRequiredFieldsToObject<RecursivePartial<GreenDotConfig>, RequiredFields>
