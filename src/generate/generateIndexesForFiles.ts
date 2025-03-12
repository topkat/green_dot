#!/usr/bin/env ts-node

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

const CONFIGS = [
  { path: './packages/backend-shared/src/apiServices', match: /\.svc\.ts/, indexFileName: 'apiServices' },
  { path: './packages/backend-shared/src/helpers', match: /\.ts/, indexFileName: 'helpers' },
] satisfies { path: string, match: RegExp, indexFileName: string }[]

//===========================

export async function generateIndexesForFiles() {
  try {

    const cwd = process.cwd()
    const monorepoRoot = await fs.exists(Path.resolve(cwd, './SDKs')) ? cwd : Path.resolve(cwd, '../')

    for (const { path: relativePath, match, indexFileName } of CONFIGS) {

      const indexBasePath = Path.resolve(monorepoRoot, relativePath)

      if (await fs.pathExists(indexBasePath)) {

        const urls = await findAllInDirRecursive(indexBasePath, match)

        const indexFileData = urls
          .filter(url => !url.endsWith(indexFileName + '.ts'))
          .map(url => `export * from './${Path.relative(indexBasePath, url).replace(/.ts$/, '')}'`)

        await fs.outputFile(`${indexBasePath}/${indexFileName}.ts`, indexFileData.join('\n'))

      } else throw 'Path do not exist in autoIndexes.ts config: '
    }
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