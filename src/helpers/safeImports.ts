import { C } from 'topkat-utils'
import Path from 'path'
import { getProjectPaths } from './getProjectPaths'


export async function safeImport(path: string) {

  const { mainConfig } = await getProjectPaths()
  const pathRelative = Path.relative(mainConfig.folderPath, path)

  C.warning(false, 'Importing ' + pathRelative)

  const resp = await import(path)

  C.clearLastLines(1)
  C.success('Imported ' + pathRelative)

  return resp
}