
import { Name as ManagedLoginName, GDmanagedLogin, defaultConfig as managedLoginDefaultConfig } from './managedLogin/main'
import { Name as SecureAuthName, GDdoubleAuthentication, defaultConfig as secureAuthDefaultConfig } from './secureAuth/main'

const allPlugins = {
  GDdoubleAuthentication,
  GDmanagedLogin,
} as const satisfies Record<PluginNames, any>

const defaultConfigs = {
  GDdoubleAuthentication: secureAuthDefaultConfig,
  GDmanagedLogin: managedLoginDefaultConfig,
} as const satisfies Record<PluginNames, any>

type InstanciatedPlugin = InstanceType<(typeof allPlugins)[PluginNames]>

const registeredPlugins = [] as InstanciatedPlugin[]

export function registerPlugin(plugin: InstanciatedPlugin) {
  registeredPlugins.push(plugin)
}

export function getPlugin<T extends PluginNames>(name: T) {
  return registeredPlugins.find(p => p.name === name) as InstanceType<(typeof allPlugins)[T]> | null
}

/** Will return plugon config if registered or default config otherwise */
export function getPluginConfig<T extends PluginNames>(name: T) {
  return (registeredPlugins.find(p => p.name === name)?.config || defaultConfigs[name]) as InstanceType<(typeof allPlugins)[T]>['config']
}

export type PluginNames = ManagedLoginName | SecureAuthName

export class GDplugin<Name extends string> {
  protected readonly name: Name
  protected readonly version: string
}