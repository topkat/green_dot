import { documentation, docOneLine } from './doc'
import { newPlugin } from '../newPlugin'
import { GDmanagedLogin } from './GDmanagedLogin'
import { defaultConfig, PluginUserConfig } from './config'

export default newPlugin<'GDmanagedLogin', PluginUserConfig>({
  name: 'GDmanagedLogin',
  version: '1.0.0',
  defaultConfig,
  documentation,
  docOneLine,
  plugin: GDmanagedLogin,
})

export { GDmanagedLogin } from './GDmanagedLogin'
