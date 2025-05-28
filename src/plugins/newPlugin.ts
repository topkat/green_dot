


export function newPlugin<
  Name extends string,
  Config extends Record<string, any>,
  T = any,
>(
  props: {
    name: Name,
    version: string
    defaultConfig: Partial<Config>
    plugin: T
    documentation: string
    docOneLine: string
  }) {
  return props
}