

import { MongoDaoMethodsFull } from '../databases/mongo/types/mongoDaoTypes'
import { ServiceRegistered } from './services.types'


export const generateSdkRouteTypes = ['dao', 'service'] as const
export type GenerateSdkRouteTypes = typeof generateSdkRouteTypes[number]

export type GenerateSdkConfig = NoExtraProperties<{
  /** by default, this will be `root_folder/SDKs/mySdk`, use a path relative to the root of your application */
  parentFolder?: string
  /** Write import syntax in sdk instead of require  */
  isEs6Import?: boolean
  /** Here you can modify the generated endpoint string for each route, which is by default calling apiCall(route, ...params)
   * * Format: (route: string, routeType: t.GenerateSdkRouteTypes) => `(...params) => apiCall(\`${route}\`, ...params)`
   */
  /** Allow to modify the path of endpoints in sdk. So addrInSdk is for example 'apiMyDbMyFunction' so you actually call it like apiServiceApiMyDbMyFunction(). Here you can .replace('api', '') to simplify the path access to apiService.myDb.myFunction() */
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
  service: Record<string, [serverKey: string, serviceName: string]>,
}

export type DbReadWriteStr = 'dbRead' | 'dbWrite'