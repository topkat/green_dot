import { GDplugin } from '../pluginSystem'


export type Name = 'GDmanagedLogin'

// Plugin system type definitions




export type PluginUserConfig = {
  enabled?: boolean
}

const defaultConfig: PluginUserConfig = {
  enabled: true,
}


export class GDmanagedLogin extends GDplugin<Name> {
  name = 'GDmanagedLogin' as const
  version = '1.0.0'

  config: PluginUserConfig

  constructor(config: PluginUserConfig) {
    super()
    this.config = { ...defaultConfig, ...config }
  }
}