
import { AsFilter, AsMongooseBody, RequestConfigRead, RequestConfigGetOne, RequestConfigWrite, MaybePaginated } from './mongodbBaseTypes.generated'
import { SdkError, ServerUrls, SdkInitOptions, Breakpoints } from './apiCall'
import { useSuspenseQuery, QueryClient, FetchQueryOptions } from '@tanstack/react-query'
import { ModelNames } from './modelTypes.generated'
import { InitBackendConfig } from './sdkHelpers/initBackend'

export * from './sdkHelpers'

type MethodNames = '%%AllMethodNameTypeString%%'

export * from './modelTypes.generated'

export type ApiType = {
  init(config: SdkInitOptions): void
  getServerUrl(): string
  /** You can set any headers that are sent to the backend on top (or replacing) already existing headers */
  setHeaders(newHeaders: Record<string, string | number>, mergeWithPrevious?: boolean): void
  /** Use this if you manually want to set authorization header. Usually, this is made automatically by the SDK */
  setAuthorization(authToken: string): void
  /** This one is like an event listener. The callback will be ran before every api request and allow to run custom code at that time */
  beforeApiCall(fn: (route: string, ...params: any[]) => any | Promise<any>): void
  /** This will invalidate the cache for target queries and make api calls again  */
  invalidateQueries(queries: (`${ModelNames}*` | MethodNames)[]): void
  /** This is used in case the SDK is used for image urls to optimize urls for app size */
  setBreakpoint(breakpoints: Breakpoints): void
  auth: {
    pinCode(pinCode: number | string): void,
    biometricAuthToken(biometricAuthToken: string): void,
    _2FA(_2FA: string): void
  }
  '%%tsApiTypes%%'
} /* %%toDeleteRealSdk */ & Record<string, any> /* toDeleteRealSdk%% */

export declare const $: ApiType

export const methodNames: { dbRead: Record<string, string>, dbWrite: Record<string, string>, service: Record<string, string> }

export default $

export declare function initBackend(serverConfig: InitBackendConfig<ServerUrls>)

/**%%export_all_ts*/