

import fs from 'fs-extra'
import Path from 'path'
import { capitalize1st, camelCase } from 'topkat-utils'
import { getDbConfigs } from '../../helpers/getGreenDotConfigs'



export async function generateModelFolderInSdk(
  sdkRoot: string,
) {

  const dbConfigs = getDbConfigs()

  let modelIndexFile = ''
  const exportLine = [] as string[]
  const allModels = [] as string[]

  for (const { generatedFolderPath, name } of dbConfigs) {

    const dbName = camelCase(name)
    const dbNameUpper = capitalize1st(dbName)

    // TODO this should use internal generated files
    const inputModelFilePath = Path.join(generatedFolderPath, 'model-types.generated.ts')
    const outputModelFilePath = `modelTypes/${dbName}ModelTypes.generated.ts`

    if (await fs.exists(inputModelFilePath)) {
      // copy and parse main index file for models
      const modelTypeFileRaw = await fs.readFile(inputModelFilePath, 'utf-8')
      const newModelTypeFile = cleanModelFileStr(modelTypeFileRaw)
      await fs.outputFile(Path.join(sdkRoot, outputModelFilePath), newModelTypeFile)

      modelIndexFile += `
export * as ${dbNameUpper}Models from './${outputModelFilePath.replace('.ts', '')}'
export * from './${outputModelFilePath.replace('.ts', '')}'
import { AllModels as ${dbNameUpper}AllModels, ModelNames as ${dbNameUpper}ModelNames } from './${outputModelFilePath.replace('.ts', '')}'
`

      exportLine.push(`${dbNameUpper}AllModels`)
      allModels.push(`${dbNameUpper}ModelNames`)
    }
  }

  modelIndexFile += `
export type AllModels = ${exportLine.join(' & ')}
export type ModelNames = ${allModels.join(' | ')}
`

  await fs.outputFile(Path.join(sdkRoot, 'model-types.generated.ts'), modelIndexFile)
}




function cleanModelFileStr(str: string) {
  return str.replace(/import \* as t from '\.\.\/1_shared\/types'/, '\n')
    .replace(/t\.ObjectId/g, 'string')
    .replace(/t\.[^ ,;)\n]+/g, 'any')
}
