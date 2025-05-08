import { C } from 'topkat-utils'
import Path from 'path'
import { getProjectPaths } from './getProjectPaths'

export async function safeImport(path: string) {

  const verbose = process.env.SAFE_IMPORT_VERBOSE === '1'

  const { mainConfig } = await getProjectPaths()

  const pathRelative = Path.relative(mainConfig.folderPath, path)

  if (verbose) C.log('Importing ' + pathRelative)

  const resp = await import(path)

  if (verbose) C.clearLastLines(1)
  if (verbose) C.success('Imported ' + pathRelative)

  return resp
}