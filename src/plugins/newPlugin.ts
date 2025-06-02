
export type NewPluginAddToVariableTemplateCtx = { roles: GD['role'][] }

type TemplateStringCallback<IsArray = false> = ((ctx: NewPluginAddToVariableTemplateCtx) => IsArray extends true ? string[] : string) | (IsArray extends true ? string[] : string)

export type NewPluginTemplateStringObject = {
  /** string to be overrided in your plugin instanciation in appConfig
  * @example `'enable: true, myCustomConfig: true,'`
  */
  instanciatePluginInAppConfig?: TemplateStringCallback
  /** Use this if you want to augment global GD variable
  * @example `apiKeys: ApiKeys`
  */
  addToGlobalType?: TemplateStringCallback<true>
  /** Add an import from ENV on top of the file
  * @example `apiKeys: ApiKeys`
  */
  addToEnvVariableImports?: TemplateStringCallback<true>
}

export type NewPluginConfig<Name, Config, Plugin> = {
  name: Name,
  version: string
  defaultConfig: Partial<Config>
  plugin: Plugin
  documentation: string
  docOneLine: string
  addToVariablesInNewProjectTemplate?: NewPluginTemplateStringObject
}

export function newPlugin<
  Name extends string,
  Config extends Record<string, any>,
  Plugin = any,
>(
  props: NewPluginConfig<Name, Config, Plugin>
) {
  return props
}