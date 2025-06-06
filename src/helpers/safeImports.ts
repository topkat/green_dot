import { C } from 'topkat-utils'
import Path from 'path'
import { getProjectPaths } from './getProjectPaths.js'

export async function safeImport(path: string) {

  path = path.replace(/\.(j|t)s$/, '') + '.js'

  const verbose = process.env.SAFE_IMPORT_VERBOSE === '1'

  const { mainConfig } = await getProjectPaths()

  let pathRelative = Path.relative(mainConfig.folderPath, path)

  if (process.env.RUN_FROM_DIST === 'false') {
    pathRelative = pathRelative.replace(Path.sep + 'dist' + Path.sep, Path.sep)
  }

  if (verbose) C.log('Importing ' + pathRelative)

  const resp = await import(path)

  if (verbose) C.clearLastLines(1)
  if (verbose) C.success('Imported ' + pathRelative)

  return resp
}