

import { PublicRole, SystemRole } from '../ctx'
import { MongoDaoMethodsFull } from '../databases/mongo/types/mongoDaoTypes'
import { ServiceRegistered } from './services.types'


export const generateSdkRouteTypes = ['dao', 'service'] as const
export type GenerateSdkRouteTypes = typeof generateSdkRouteTypes[number]

export type GenerateSdkConfig = NoExtraProperties<{
  /** Enable generating a SDK for each one of your roles. For reminder, each roles correspond to a particular UI or entry point in the app, so User role may connect to a mobile app and Admin role may use a web dashboard. Each one of them needing their own SDK. */
  enable: boolean
  /** In green_dot, every role represents a different UI (platform). So let's say you have a webapp and an admin dashboard, the object will be formatted as follow: `{ admin: 'adminSdk', user: 'appSdk' }`. */
  sdkNameForRole: { [role in Exclude<GD['role'], SystemRole | PublicRole>]: GD['platform'] }
  /** by default, this will be `root_folder/SDKs/mySdk`, use a path relative to the root of your application */
  parentFolder?: string
  /** Publish SDKs on NPM via prompt that let's you choose what to publish. This can be useful to really separate back/front and be able to consume the SDK in another project */
  npmPublishPromptConfig?: {
    enable: boolean
    /** This will be the package.json access */
    access: 'public' | 'private'
    /** The full token in the form of npm_Rand0mStr1ng... */
    npmAccessTokenForPublish: string
    packageNamePrefix?: string
  }
  /** Notify on telegram when there is a new release */
  notifyOnTelegramPrompt?: {
    chatId: number
    /** Format => bot73344xxx89:AAxxxxxxxxfh6LdxxxxcqxxxbMR-MBMxxtQ */
    botId: string
  }
  /** Write import syntax in sdk instead of require  */
  isEs6Import?: boolean
  /** Here you can modify the generated endpoint string for each route, which is by default calling apiCall(route, ...params)
   * * Format: (route: string, routeType: t.GenerateSdkRouteTypes) => `(...params) => apiCall(\`${route}\`, ...params)`
   */
  processAddrInSdk?: (addrInSdk: string) => string,
  /** Allow to filer routes to expose in sdk: (route) => !route.includes('mongo') */
  shallExposeRoute?: (route: string) => boolean
}>

export type RouteFromDaoConfigForGenerateSdk = {
  [platform: string]: {
    [route: string]: { dbType: 'mongo', daoMethod: MongoDaoMethodsFull, modelName: string, dbId: string, dbName: string }
  }
}

export type RouteFromSevicesConfigForGenerateSdk = {
  [platform: string]: {
    [route: string]: ServiceRegistered
  }
}

/** All types should be JSON stringifiable so no function...etc */
export type GenerateSDKparamsForService = {
  [platform: string]: {
    objectTs: Record<string, string>
    /** Service method that are only defined in actual backend */
    serviceMethods: string[]
    sharedServiceMethods: string[]
    methodConfigService: Record<string, string>
    queriesToInvalidate: { [queryName: string]: string[] }
  }
}

export type GenerateSDKparamsForDao = {
  [platform: string]: {
    objectTs: Record<string, string>
    allMethodNames: string[]
    methodConfigAll: Record<DbReadWriteStr, Record<string, string>>
  }
}

export type AllMethodsObjectForSdk = GenerateSDKparamsForDao[string]['methodConfigAll'] & {
  service: { [serviceName: string]: { server: string, route: string } },
}

export type DbReadWriteStr = 'dbRead' | 'dbWrite'