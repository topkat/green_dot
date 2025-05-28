import { GDplugin } from './GDplugin'




export function newPlugin<
  Name extends string,
  Config extends Record<string, any>
>(props: {
  name: Name,
  version: string
  defaultConfig: Partial<Config>
  plugin: GDplugin<Name>
  documentation: string
  docOneLine: string
}) {
  return props
}