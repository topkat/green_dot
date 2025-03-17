import { C } from 'topkat-utils'
import Path from 'path'
import { getProjectPaths } from './getProjectPaths'

export async function safeImport(path: string) {

  const silent = process.env.SAFE_IMPORT_SILENT === '1'

  const { mainConfig } = await getProjectPaths()
  const pathRelative = Path.relative(mainConfig.folderPath, path)

  if (!silent) C.warning(false, 'Importing ' + pathRelative)

  const resp = await import(path)

  if (!silent) C.clearLastLines(1)
  if (!silent) C.success('Imported ' + pathRelative)

  return resp
}