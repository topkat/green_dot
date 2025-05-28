

import type { GDpluginHandlerEventNames } from './GDplugin'
import { Name as ManagedLoginName, GDmanagedLogin, defaultConfig as managedLoginDefaultConfig, docOneLine as managedLoginOneLineDoc } from './GDmanagedLogin/main'
import { Name as SecureAuthName, GDdoubleAuthentication, defaultConfig as secureAuthDefaultConfig, docOneLine as doubleAutOneLineDoc } from './GDdoubleAuthentication/main'
import { Name as GDapiKeyAuthenticationName, GDapiKeyAuthentication, defaultConfig as GDapiKeyAuthenticationNameDefaultConfig, docOneLine as apiKeyAuthOneLineDoc } from './GDapiKeyAuthentication/main'
import { ServiceGeneric } from '../types/services.types'


export const allPlugins = {
  GDdoubleAuthentication,
  GDmanagedLogin,
  GDapiKeyAuthentication,
} as const satisfies Record<PluginNames, any>

export const allOneLineDoc = {
  GDdoubleAuthentication: doubleAutOneLineDoc,
  GDmanagedLogin: managedLoginOneLineDoc,
  GDapiKeyAuthentication: apiKeyAuthOneLineDoc,
} as const satisfies Record<PluginNames, string>

export type PluginNames = ManagedLoginName | SecureAuthName | GDapiKeyAuthenticationName

const defaultConfigs = {
  GDdoubleAuthentication: secureAuthDefaultConfig,
  GDmanagedLogin: managedLoginDefaultConfig,
  GDapiKeyAuthentication: GDapiKeyAuthenticationNameDefaultConfig,
} as const satisfies Record<PluginNames, any>

export type InstanciatedPlugin = InstanceType<(typeof allPlugins)[PluginNames]>

const registeredPlugins = [] as InstanciatedPlugin[]

export function registerPlugin(plugin: InstanciatedPlugin) {
  if (plugin.config.enable) registeredPlugins.push(plugin)
}

export function getPlugin<T extends PluginNames>(name: T) {
  return registeredPlugins.find(p => p.name === name) as InstanceType<(typeof allPlugins)[T]> | null
}

/** Will return plugon config if registered or default config otherwise */
export function getPluginConfig<T extends PluginNames>(name: T) {
  return (registeredPlugins.find(p => p.name === name)?.config || defaultConfigs[name]) as InstanceType<(typeof allPlugins)[T]>['config']
}

export function getAllPluginServices() {
  return registeredPlugins.reduce((allServices, p) => ({ ...p.serviceToRegister, ...allServices }), {} as Record<string, ServiceGeneric>)
}

export function getPluginHook(eventName: GDpluginHandlerEventNames) {
  return registeredPlugins.map(p => p.handlers.filter(h => h.event === eventName)).flat()
}

export function getAllPluginsOneLineDoc(eventName: GDpluginHandlerEventNames) {
  return Object.values(allPlugins).map(p => p.)
}

// type AllPlugins = (typeof allPlugins)
// type OO = {
//   [K in PluginNames]: InstanceType<AllPlugins[K]> extends { addUserAdditionalFields: any } ? InstanceType<AllPlugins[K]>['addUserAdditionalFields'] : never
// }



// type TypeRead = InferTypeRead<ReturnType<OO[PluginNames]>>
// type TypeWrite = InferTypeWrite<ReturnType<InstanciatedPlugin['addUserAdditionalFields']>>

// declare module '../security/userAndConnexion/userAdditionalFields' {
//   interface UserAdditionalFieldsRead extends TypeRead { }
//   interface UserAdditionalFieldsWrite extends TypeWrite { }
// }