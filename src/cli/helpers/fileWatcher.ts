
// /!\ TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE /!\ \\
import chokidar from 'chokidar'
import { getProjectPaths } from '../../helpers/getProjectPaths.js'


export async function onFileChange(
  onFileChangeCallback: (filePath: string) => any,
  {
    /** Autoclose watcher on first change */
    autoClose = false,
    /** Await until a file change occurs */
    awaitChange = true
  } = {}
) {

  const paths = await getProjectPaths()

  const w = chokidar
    .watch(paths.mainConfig.folderPath, {
      // persistent: true, // Keep process alive
      ignored: [
        /node_modules/,
        /\/dist\//,
        /(^|[/\\])\../, // dot files
        /\.generated\.[a-zA-Z0-9_]{1,5}$/,
        /SDKs/,
      ],
      ignoreInitial: true,
    })

  return new Promise((resolve) => {
    w.on('change', async (path) => {
      if (autoClose) w.close()
      await onFileChangeCallback(path)
      resolve(true)
    })
    if (!awaitChange) resolve(true)
  })
}