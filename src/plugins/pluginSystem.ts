

import type { GDpluginHandlerEventNames } from './GDplugin.js'
import GDmanagedLogin from './GDmanagedLogin/main.js'
import GDdoubleAuthentication from './GDdoubleAuthentication/main.js'
import GDapiKeyAuthentication from './GDapiKeyAuthentication/main.js'
import { ServiceGeneric } from '../types/services.types.js'
import { type NewPluginConfig } from './newPlugin.js'

export type PluginNames = typeof GDmanagedLogin.name | typeof GDdoubleAuthentication.name | typeof GDapiKeyAuthentication.name

export const allPluginConfigs: Record<PluginNames, NewPluginConfig<any, any, any>> = {
  GDdoubleAuthentication,
  GDmanagedLogin,
  GDapiKeyAuthentication,
}

type AllPluginConfig = typeof allPluginConfigs


export type InstanciatedPlugin = InstanceType<AllPluginConfig[PluginNames]['plugin']>

const registeredPlugins = [] as InstanciatedPlugin[]

export function registerPlugin(plugin: InstanciatedPlugin) {
  if (plugin.config.enable) registeredPlugins.push(plugin)
}

export function getPlugin<T extends PluginNames>(name: T) {
  return registeredPlugins.find(p => p.name === name) as InstanceType<(typeof allPluginConfigs)[T]['plugin']> | null
}

/** Will return plugin config if registered or default config otherwise */
export function getPluginConfig<T extends PluginNames>(name: T) {
  return (registeredPlugins.find(p => p.name === name)?.config || Object.values(allPluginConfigs).find(p => p.name === name)?.defaultConfig) as InstanceType<(typeof allPluginConfigs)[T]['plugin']>['config']
}

export function getAllPluginServices() {
  return registeredPlugins.reduce((allServices, p) => ({ ...(p.serviceToRegister || {}), ...allServices }), {} as Record<string, ServiceGeneric>)
}

export function getPluginHook(eventName: GDpluginHandlerEventNames) {
  return registeredPlugins.map(p => p.handlers.filter(h => h.event === eventName)).flat()
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