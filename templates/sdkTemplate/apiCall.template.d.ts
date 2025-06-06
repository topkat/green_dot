
import 'typescript-generic-types'
import { QueryClient } from '@tanstack/react-query.js'


export type SdkError = {
  message: string
  code: number
  [key: string]: any
}

export type Breakpoints = 'XS' | 'SM' | 'MD' | 'L'

export type SdkInitOptions = {
  serverUrls: ServerUrls
  onErrorCallback?: (errObject: SdkError | Record<string, any>) => void
  headers?: Record<string, any>
  getQueryClient?(): QueryClient
  /** Get item from local storage */
  localStorageGet?(key: string): any
  /** Set item from local storage */
  localStorageSet?(key: string, value: any): any
}

export declare function init(options: SdkInitOptions): void

type Apps = '%%allAppNamesTypeString%%'
export type ServerUrls = Record<'%%allBackendFoldersForSdk%%', string> & { default: '%%allBackendFoldersForSdk%%' }

export declare function apiCall(app: Apps, route: string, ...params: any[]): Promise<any>

export declare function setHeaders(newHeaders: Record<string, string | number>, mergeWithPrevious: boolean): void

export declare function onError(errObject: SdkError | Record<string, any>, status: number): void

export declare function beforeApiCall(fn: (route: string, ...params: any[]) => any | Promise<any>): void

type ServerState = {
  hasBeenInitialised: boolean
  serverUrl: ServerUrls
  headers: Record<string, any>
  getQueryClient: () => null | QueryClient
}
export declare function getServerState(): ServerState

export declare const methodNames: {
  service: [server: string, route: string]
  dbRead: Record<string, string>
  dbWrite: Record<string, string>
}