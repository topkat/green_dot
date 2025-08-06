

import { SdkInitOptions } from './types.js'
import { registerConfig, C } from 'topkat-utils'
import { get$ } from './init.js'


registerConfig({ terminal: { noColor: true } })


let isInitialized = false

//----------------------------------------
// BASE CONFIG
//----------------------------------------
export type InitSdkConfig<ServerConfig> = {
  projectName: string
  getDeviceId(): string | Promise<string>
  onLogout?(): void | Promise<void>
  onSdkInitialized?(): any | Promise<string>
  refreshTokenExpirationMinutes?: number
  refreshTokenErrorMessage?: string
  wrongTokenErrorMessage?: string
} & SdkInitOptions<ServerConfig>

const notImplementedErrMsg = (fnName: string) => { throw new Error(`${fnName}() is not set in backend. Check backend has been initialized correctly`) }

const fakeLs = {}

const cacheLocalStorage = {
  get: key => fakeLs[key],
  set: (key, val) => fakeLs[key] = val.toString(),
  remove: key => delete fakeLs[key],
}

const backendConfig: InitSdkConfig<any> = {
  serverUrls: { default: 'backend', backend: 'http://localhost:9086' },
  projectName: 'undefined',
  getDeviceId: () => notImplementedErrMsg('getDeviceId'),
  localStorageSet: cacheLocalStorage.set,
  localStorageGet: cacheLocalStorage.get,
  localStorageRemove: cacheLocalStorage.remove,
  onErrorCallback: error => { throw error },
  refreshTokenExpirationMinutes: 15,
  refreshTokenErrorMessage: 'Wrong refresh token',
  wrongTokenErrorMessage: 'Wrong Token',
}

//----------------------------------------
// INITIALIZATION
//----------------------------------------
export function initSdk<ServerConfig>(config: InitSdkConfig<ServerConfig>) {

  Object.assign(backendConfig, config)

  const apiUrl = backendConfig?.serverUrls[backendConfig.serverUrls?.default]

  if (!apiUrl) C.error(false, 'API URL NOT SET FOR BACKEND', JSON.stringify(backendConfig, null, 2))

  C.log(`ⓘ apiUrl ` + JSON.stringify(apiUrl))
  get$().init(backendConfig)

  isInitialized = true
}

export function isSdkInitialized() {
  return isInitialized
}

export function getSdkConfig() {
  return backendConfig
}