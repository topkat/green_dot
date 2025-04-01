import { QueryClient } from '@tanstack/react-query'



export type SdkInitOptions<AppConfig = ServerUrls> = {
  serverUrls: AppConfig
  onErrorCallback?: (errObject: SdkError | Record<string, any>) => void
  headers?: Record<string, any>
  getQueryClient?(): QueryClient
  /** Get item from local storage */
  localStorageGet?(key: string): any
  /** Set item from local storage */
  localStorageSet?(key: string, value: any): any
  /** Remove item from local storage */
  localStorageRemove?(key: string): any
}

export type ServerUrls = Record<any, string> & { default: any }

export type SdkError = {
  message: string
  code: number
  [key: string]: any
}