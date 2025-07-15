export type SdkInitOptions<ServerConfig = ServerUrls> = {
  serverUrls: ServerConfig
  onErrorCallback?: (errObject: SdkError | Record<string, any>) => void
  headers?: Record<string, any>
  getQueryClient?(): {
    getQueriesData: any
    setQueryData: any
    setQueriesData: any
    getQueryState: any
    removeQueries: any
    resetQueries: any
    cancelQueries: any
  }
  /** Get item from local storage */
  localStorageGet?(key: string): any
  /** Set item from local storage */
  localStorageSet?(key: string, value: any): any
  /** Remove item from local storage */
  localStorageRemove?(key: string): any
}

export type ServerUrls = Record<any, string> & { default: any }

export type SdkError = {
  msg: string
  code: number
  [key: string]: any
}