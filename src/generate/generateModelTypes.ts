
import fs from 'fs-extra'
import path from 'path'
import { Definition } from '../types/core.types'

import { capitalize1st } from 'topkat-utils'
import { safeImport } from '../helpers/safeImports'
// TODO DELETEME
type ModelNames = {
    fileNameDashCase: string;
    fileNameCamelCase: string;
    modelRelativePath: string;
}[]

const indentUnit = '    '

export async function generateModelTypes(modelFiles: ModelNames, generatedFilePathServer: string) {
    let fileOutput = `\n\n`

    const modelNames = Object.values(modelFiles).map((v: any) => v.fileNameCamelCase)

    //----------------------------------------
    // GENERATE DEFAULT VALID TYPESCRIPT FILE
    // This is in case generated file is imported in a model file
    //----------------------------------------
    const fileTemplate = `
${modelNames.map(modelName => {
        const ModelNameCapitalized = capitalize1st(modelName)
        return `
export type ${ModelNameCapitalized} = any
export type ${ModelNameCapitalized}Write = any
export interface ${ModelNameCapitalized}Models { Write: ${ModelNameCapitalized}Write, Read: ${ModelNameCapitalized} }`
    }).join('\n')}
export type AllModels = {
    ${modelNames.map(modelName => {
        const ModelNameCapitalized = capitalize1st(modelName)
        return `    ${modelName}: ${ModelNameCapitalized}Models`
    }).join('\n')}
}
export type ModelNames = keyof AllModels
`

    await fs.writeFile(path.join(generatedFilePathServer, 'model-types.generated.ts'), fileTemplate)

    //----------------------------------------
    // GENERATED REAL TYPESCRIPT FILE
    //----------------------------------------

    const { models } = await safeImport(path.join(generatedFilePathServer, 'models.generated'))

    for (const [modelName, model] of Object.entries(models) as [string, Definition][]) {

        const modelNameCap = capitalize1st(modelName)

        const tsTypes = model.getTsTypeAsString()

        for (const meth of ['read', 'write'] as const) {
            tsTypes[meth] = tsTypes[meth].replace(/modelTypes\./g, '')
        }

        fileOutput += `export type ${modelNameCap} = ${tsTypes.read}\n\n`
        fileOutput += `export type ${modelNameCap}Write = ${tsTypes.write}\n\n`
        fileOutput += `export interface ${modelNameCap}Models {\n${indentUnit}Write: ${modelNameCap}Write\n${indentUnit}Read: ${modelNameCap}\n}\n\n`
    }

    fileOutput += `export type AllModels = {\n${modelNames.map(modelName => `${indentUnit}${modelName}: ${capitalize1st(modelName + 'Models')}`).join(`\n`)}\n}\n\n`

    fileOutput += `export type ModelNames = keyof AllModels\n\n`

    await fs.writeFile(path.join(generatedFilePathServer, 'model-types.generated.ts'), fileOutput)
}
