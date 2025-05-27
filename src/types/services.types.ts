

import { LocalConfigParsed } from '../databases/mongo/types/mongoDbTypes'
import { Definition, GenericDef, InferTypeRead } from 'good-cop'
import { RateLimiterConfig } from '../security/serviceRouteRateLimiter'
import { DaoGenericMethods } from './daoGeneric.types'
import { ForClauseParsed, ForClauseWithAll } from './coreGeneric.types'
import { ModelReadWrite } from './models.types'
import { AuthenticationMethod } from '../ctx'
import { MaybeArray } from 'typescript-generic-types'
import { ModelNames } from '../cache/dbs/index.generated'


//----------------------------------------
// SERVICES
//----------------------------------------
export type GenericEventTypes = 'ctx.creation' | 'server.start'

export type BaseService = {
  /** This serves as a comment in code and documentation */
  doc?: string | ServiceDocObject
  /** Shall be this service be triggered on an event (`server.start`, `user.create`,...) */
  on?: MaybeArray<GenericEventTypes[]> | MaybeArray<string>
  /** In case multiple services are triggered by an event, how this one should be prioritized. The lower, the prior. From 0 to 100 */
  priority?: number
  /** Determines in which env this service is meant to be executed. If in the wrong env, the service will not be executed */
  forEnv?: Env | Env[],
  /** The main function of the service */
  main(ctx: Ctx, ...params: any[]): any
}


//----------------------------------------
// DAO EVENT
//----------------------------------------
type EventCtx = Ctx & Omit<LocalConfigParsed, 'method'>

export type CreateEventBeforeCtx<Model extends ModelReadWrite> = {
  method: Extract<DaoGenericMethods, 'create'>
  createdId?: string
  /** The fields provided as input */
  inputFields: Partial<Model['Write']>
} & EventCtx

export type CreateEventAfterCtx<Model extends ModelReadWrite> = {
  method: Extract<DaoGenericMethods, 'create'>
  createdId: string
  /** The fields provided as input */
  inputFields: Partial<Model['Write']>
} & EventCtx

export type UpdateEventCtx<Model extends ModelReadWrite> = {
  method: Extract<DaoGenericMethods, 'update'>,
  /** CAN BE UNDEFINED IN case of an updateAll */
  updatedId?: string,
  inputFields: Partial<Model['Write']>,
} & EventCtx

export type GetAllEventBeforeCtx = {
  method: Extract<DaoGenericMethods, 'getAll'>
} & EventCtx

export type GetOneEventBeforeCtx = {
  method: Extract<DaoGenericMethods, 'getOne'>
} & EventCtx

export type GetAllEventAfterCtx<Model extends ModelReadWrite> = {
  method: Extract<DaoGenericMethods, 'getAll'>
  data: Model['Read'][]
} & EventCtx

export type GetOneEventAfterCtx<Model extends ModelReadWrite> = {
  method: Extract<DaoGenericMethods, 'getOne'>
  data: Model['Read']
} & EventCtx

export type DeleteEventCtx = {
  method: Extract<DaoGenericMethods, 'delete'>
  deletedId: string
} & EventCtx


export interface DaoEventService<
  AllModels extends Record<string, ModelReadWrite>,
  ModelName extends string & keyof AllModels,
  Method extends DaoGenericMethods,
  BeforeOrAfter extends 'after' | 'before',
  Model extends AllModels[ModelName] = AllModels[ModelName]
> extends BaseService {
  on: MaybeArray<`${ModelName}.${Method}.${BeforeOrAfter}`>,
  main(
    // CREATE
    ctx: Method extends 'create'
      ? BeforeOrAfter extends 'before'
      ? CreateEventBeforeCtx<Model>
      : CreateEventAfterCtx<Model>
      // UPDATE
      : Method extends 'update'
      ? UpdateEventCtx<Model>
      // GET ONE
      : Method extends 'getOne'
      ? BeforeOrAfter extends 'before'
      ? GetOneEventBeforeCtx
      : GetOneEventAfterCtx<Model>
      // GET ALL
      : Method extends 'getAll'
      ? BeforeOrAfter extends 'before'
      ? GetAllEventBeforeCtx
      : GetAllEventAfterCtx<Model>
      // DELETE
      : Method extends 'delete'
      ? DeleteEventCtx
      : never
  ): void | ObjectGeneric
}


//----------------------------------------
// API
//----------------------------------------

export type ApiMethod = 'POST' | 'PATCH' | 'DELETE' | 'GET' | 'PUT'

export type ParamValidatorObj = readonly Definition[]




export interface Service<
  InputType extends Record<string, GenericDef> | GenericDef | GenericDef[] = [],
  OutputType extends GenericDef = undefined
> extends BaseService {

  /** Input Params (body of the request) types for runtime validation and typing. You can:
  * * Use good-cop types, like: _.number() or _.object({...})
  * * Use an array of types like [_.number(), _.boolean()]
  * * Use a simple object like { nb: _.number(), bool: _.boolean() }
  This will infer the typescript type and validate params at runtime
   */
  input?: Readonly<InputType>

  /** Service Return Type for runtime validation and typing. Use good-cop type, like _.number() or _.object({...}) */
  output?: OutputType

  /** The main function for the service, call it in app with myService.main(...), in the api you can access it via SDK like $.myService() */
  main(
    ctx: Ctx & { inputType?: InputTypeInferred<InputType>, outputType?: OutputType['tsTypeRead'] },
    ...props: InputToDefinition<InputType>
  ): MaybePromise<OutputType['tsTypeRead']>


  /** Determines which permissions can apply for this service. All not authorized will receive a 403/404 forbidden error and the service will not be executed. Can also be a name of an apiKey (You can configure your apiKeys in apiKeys.ts) */
  for?: ForClauseWithAll<GD['apiKeys']>
  /** See .for */
  notFor?: MaybeArray<GD['role']> // cannot be a straight for clause
  /** If route is not set, it will take the name of the file */
  route?: string | [ApiMethod, string]
  /** In case this service can be reached via another route */
  aliasRoute?: string
  /** You can also use the shorthand route: ['GET', '/users'] */
  method?: ApiMethod
  /** This may be useful if you want to generate types but to manually validate / parse the body */
  doNotValidate?: boolean
  /** This is a rate limiter, useful to avoid this route to be triggered too much by the same IP address on a certain amount of time. Eg: allow a user to reach this route only 2 times per minutes, if more it will be rejected with a 429 tooMuchAttemps */
  rateLimiter?: RateLimiterConfig
  /** cronjob config */
  schedule?: string | Schedule
  /** true if this service shall not be generated in the SDK */
  maskInSdk?: boolean
  /** Determines which ip(s) can use this service */
  ipWhitelist?: string[]
  /** Invalidate cache of other requests when using this service in the SDK in frontend. For example if you create a service to create a transaction, you wish that that service can clear the cache for all DB transaction read request ? In this case, you just have to write ['transaction*'] to clear the cache for all queries starting with transaction or ['transactiongetAll'] for a specific one */
  invalidateCacheFor?: Array<`${ModelNames}*` | (string & {})>
  // authorizedAuthentications: AuthenticationMethod[]
  needsFingerprintOrPincode?: boolean
  needs2FA?: boolean


  // PRIVATE
  /** Used to determine is the service is unique to a backend or shared among all backends, not to be used by developpers */
  _isSharedService?: boolean

  _inputType?: InputTypeInferred<InputType>
}

type InputTypeInferred<InputType> = InferTypeRead<
  InputType extends GenericDef
  ? InputType
  : InputType extends any[]
  ? InputType
  : { [K in keyof InputType]: InputType[K] extends GenericDef ? InputType[K] : never }
>

type InputToDefinition<T = []> =
  // ARRAY TYPES
  T extends [] ? []
  : T extends [GenericDef]
  ? [T[0]['tsTypeRead']]
  : T extends [GenericDef, GenericDef]
  ? [T[0]['tsTypeRead'], T[1]['tsTypeRead']]
  : T extends [GenericDef, GenericDef, GenericDef]
  ? [T[0]['tsTypeRead'], T[1]['tsTypeRead'], T[2]['tsTypeRead']]
  : T extends [GenericDef, GenericDef, GenericDef, GenericDef]
  ? [T[0]['tsTypeRead'], T[1]['tsTypeRead'], T[2]['tsTypeRead'], T[3]['tsTypeRead']]
  : T extends [GenericDef, GenericDef, GenericDef, GenericDef, GenericDef]
  ? [T[0]['tsTypeRead'], T[1]['tsTypeRead'], T[2]['tsTypeRead'], T[3]['tsTypeRead'], T[4]['tsTypeRead']]
  // DEFINITION
  : T extends GenericDef
  ? [T['tsTypeRead']]
  // OBJECT OF DEFINITIONS
  : ExtendsRequiredDef<T> extends true ? [InputValidator<T>] : [InputValidator<T>?]


type InputValidator<T> = ( // Type alias for readability (also in intellisense)
  // REQUIRED
  RemoveTypeFromObj<{
    [K in keyof T]: T[K] extends { tsTypeRead: any, isRequiredType: true } ? T[K]['tsTypeRead'] : 'undef'
  }, 'undef'> &
  // OPTIONAL
  Partial<RemoveTypeFromObj<{
    [K in keyof T]: T[K] extends { tsTypeRead: any, isRequiredType: false } ? T[K]['tsTypeRead'] : 'undef'
  }, 'undef'>>
)

type ExtendsRequiredDef<T> = T extends { isRequiredType: true } ? true : (HasPropertyOfType<T, { isRequiredType: true }> extends true ? true : false)


const fieldsToBeCleaned = ['input', 'main', 'notFor', 'output', 'route', 'doc', 'needsFingerprintOrPincode', 'needs2FA'] as const satisfies Readonly<(keyof Service)[]> // just to lock the type...

export type ServiceClean<Svc extends Service<any, any> = Service<[], undefined>> = Omit<Svc, typeof fieldsToBeCleaned[number]> & {
  /** Convert all inputs to array of definitions */
  input: Definition[],
  /** Convert output to definition type which is more accurate than GenericDef */
  output: Definition,
  /** Convert MaybePromise to Promise for simpler typescript types */
  main(ctx: Ctx, ...params: Tail<Parameters<Svc['main']>>): Promise<ReturnType<Svc['main']>>
  // route is no more an array
  route?: string
  /** List of authorized authentications used by the user */
  authorizedAuthentications: AuthenticationMethod[]
  //
  doc: ServiceDocObject
  hasBeenParsed: true
}

export type ServiceDocObject = {
  description: string,
  errors?: [apiResponseCode: Exclude<ApiResponses, 200>, errorMessage: string, description?: string][]
}

type Tail<T extends readonly any[]> = T extends readonly [any, ...infer Rest] ? Rest : never

export const apiResponses = [200, 400, 401, 402, 403, 404, 409, 422, 429, 500] as const
export type ApiResponses = typeof apiResponses[number]

//----------------------------------------
// SCHEDULE
//----------------------------------------

// eslint-disable-next-line @typescript-eslint/ban-types
export type ScheduleString =
  'server.start'
  | 'never'
  | '0 * * * *'
  | (string & {}) // hack for types and string

export type Schedule = {
  frequency: ScheduleString
  frequencyTestEnv?: ScheduleString
  frequencyDevEnv?: ScheduleString
}

export interface ScheduleService extends BaseService {
  schedule: string | Schedule
  on?: GenericEventTypes | GenericEventTypes[] | string
  /** The lower, the prior. From 0 to 100 */
  priority?: number
  main(ctx: Ctx): void
}

export type ServiceRegistered = Omit<ServiceClean, 'for'> & {
  for: ForClauseParsed[]
  serviceName: string
  isPublic: boolean
}






export type AllServicesKeys = keyof DaoEventService<any, any, any, any, any> | keyof ServiceClean | keyof ScheduleService

export type ServiceGeneric = DaoEventService<any, any, any, any> | ServiceClean | ScheduleService

export type ServicesObj = { [serviceName: string]: ServiceGeneric } & { initApp: () => Promise<any> }