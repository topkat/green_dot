

import type { GDpluginHandlerEventNames } from './GDplugin'
import GDmanagedLogin from './GDmanagedLogin/main'
import GDdoubleAuthentication from './GDdoubleAuthentication/main'
import GDapiKeyAuthentication from './GDapiKeyAuthentication/main'
import { ServiceGeneric } from '../types/services.types'
import { newPlugin } from './newPlugin'

export type PluginNames = typeof GDmanagedLogin.name | typeof GDdoubleAuthentication.name | typeof GDapiKeyAuthentication.name

export const allPluginConfigs = {
  GDdoubleAuthentication,
  GDmanagedLogin,
  GDapiKeyAuthentication,
} as const satisfies Record<PluginNames, ReturnType<typeof newPlugin>>

type AllPluginConfig = typeof allPluginConfigs


export type InstanciatedPlugin = InstanceType<AllPluginConfig[PluginNames]['plugin']>

const registeredPlugins = [] as InstanciatedPlugin[]

export function registerPlugin(plugin: InstanciatedPlugin) {
  if (plugin.config.enable) registeredPlugins.push(plugin)
}

export function getPlugin<T extends PluginNames>(name: T) {
  return registeredPlugins.find(p => p.name === name) as InstanceType<(typeof allPluginConfigs)[T]> | null
}

/** Will return plugon config if registered or default config otherwise */
export function getPluginConfig<T extends PluginNames>(name: T) {
  return (registeredPlugins.find(p => p.name === name)?.config || defaultConfigs[name]) as InstanceType<(typeof allPluginConfigs)[T]>['config']
}

export function getAllPluginServices() {
  return registeredPlugins.reduce((allServices, p) => ({ ...p.serviceToRegister, ...allServices }), {} as Record<string, ServiceGeneric>)
}

export function getPluginHook(eventName: GDpluginHandlerEventNames) {
  return registeredPlugins.map(p => p.handlers.filter(h => h.event === eventName)).flat()
}

export function getAllPluginsOneLineDoc(eventName: GDpluginHandlerEventNames) {
  return Object.values(allPluginConfigs).map(p => p.)
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