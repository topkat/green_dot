/**========================================================

This script generate indexes automatically for a folder
given a matching pattern. For example it will reference
all .svc files found in subdirectories in an index file
set in the CONFIGS variable

*========================================================*/

import Path from 'path'
import fs from 'fs-extra'

import { round2, C } from 'topkat-utils'

//===========================

export type AutoIndexFileConfig = { path: string, match: RegExp, indexFileName: string }

const start = Date.now()

export async function autoIndex(fileConfigs: AutoIndexFileConfig[], basePath: string) {
  try {

    for (const { path: relativePath, match, indexFileName: indexFileNameRaw } of fileConfigs) {

      const indexFileName = indexFileNameRaw.replace(/\.(t|j)sx?$/, '')

      const indexBasePath = Path.resolve(basePath, relativePath)

      if (await fs.pathExists(indexBasePath)) {

        const urls = await findAllInDirRecursive(indexBasePath, match)
        const indexFileData = urls
          .filter(url => !url.endsWith(indexFileName + '.ts'))
          .map(url => `export * from './${Path.relative(indexBasePath, url).replace(/.ts$/, '')}'`)

        await fs.outputFile(`${indexBasePath}/${indexFileName}.ts`, indexFileData.join('\n'))

      } else C.warning(false, `Path ${indexBasePath} do not exist. Please check your autoIndex config in green_dot.config.ts`)
    }

    C.success('Indexes files generated for client:\n' + fileConfigs.map(c => '    * ' + c.path.replace(/^\.\//, '')).join('\n'))

    C.success(`Finished in ${round2((Date.now() - start) / 1000)}s`)
  } catch (e) { C.error(e) }
  process.exit()
}




//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

async function findAllInDirRecursive(dirPath: string, match: RegExp) {

  const urls = [] as string[]
  const filesPathInFolder = await fs.readdir(dirPath)

  for (const filePath of filesPathInFolder) {
    const filePathAbsolute = Path.join(dirPath, filePath)
    const stats = await fs.stat(filePathAbsolute)
    if (stats.isDirectory()) {
      const newUrls = await findAllInDirRecursive(filePathAbsolute, match)
      urls.push(...newUrls)
    } else if (match.test(filePathAbsolute)) {
      urls.push(filePathAbsolute)
    }
  }
  return urls
}