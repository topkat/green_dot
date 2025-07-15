export type SdkInitOptions<ServerConfig = ServerUrls> = {
  serverUrls: ServerConfig
  onErrorCallback?: (errObject: SdkError | Record<string, any>) => void
  headers?: Record<string, any>
  getQueryClient?(): {
    getQueriesData: Function
    setQueryData: Function
    setQueriesData: Function
    getQueryState: Function
    removeQueries: Function
    resetQueries: Function
    cancelQueries: Function
    clear: Function
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

export type DeviceType = {
  'user'?: string
  'deviceName': string
  'deviceType': 'desktop' | 'mobile' | 'tablet' | 'unknown'
  'os'?: 'ios' | 'macos' | 'linux' | 'windows' | 'android' | 'other'
  'browser'?: 'firefox' | 'chrome' | 'safari' | 'other' | 'opera' | 'edge' | 'internetExplorer'
  'pixelHeight'?: number
  'pixelWidth'?: number
  'language'?: string
  'isWeb'?: boolean
  'deviceInfos'?: {}
  '_id': string
}