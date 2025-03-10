

import fs from 'fs-extra'
import path from 'path'
import getAllFilesOfType from './getAllFileOfType'

import { camelCase, C } from 'topkat-utils'

const rootPath = process.cwd()

export type GenerateImportConfigType = {
    spread?: boolean,
    importAllAs?: boolean,
    ignore?: string[],
    generateOutput?: typeof generateOutputDefault
    fileStartBase?: string,
    fileNamesForExport?: string[]
}

type FileDescriptor = { fileNameDashCase: string, fileNameCamelCase: string, modelRelativePath: string }

/** Will generate a static file with all imports from modules
 * @param {string} fileTypeStr Eg: ".model.js"
 * @param {string} outputFileName Eg: models.generated.js
 * @param {object} config
 * * spread => all will be exported on same level: export { ...fileContent1, ...fileContent2 }
 * * ignore => ['fileContainingThatStringWillBeExcluded']
 */
export function generateImportMappingFile(generatedFilePathServer: string, fileTypeStr: string, outputFileName, config: GenerateImportConfigType = {}) {

    const rootDir = 'src'

    const { spread = false, importAllAs = false, ignore = ['/templates'], generateOutput = generateOutputDefault, fileStartBase = '', fileNamesForExport = [] } = config

    const files = getAllFilesOfType(path.resolve(path.join(rootPath, rootDir)) + `/**/*${fileTypeStr}`, ignore)
    let fileStart = fileStartBase

    const output: FileDescriptor[] = []
    for (const filePath of files) {
        let fileType
        try {
            const [, fileNameDashCaseMayHavePoints, ft] = filePath.match(/\/([^/]+)\.([a-z-]+).(js|ts)/) || []
            const fileNameDashCase = fileNameDashCaseMayHavePoints
                .replace(/\./g, '-') // replace '.' by '-'
                .replace(/([a-z])([A-Z])/g, '$1-$2') // uncamelcaseify
                .toLowerCase()
            fileType = ft
            let fileNameCamelCase = camelCase(...fileNameDashCase.split('-'))
            if (fileNameCamelCase === 'default') fileNameCamelCase = '_default'

            const filePathFromRoot = filePath.includes(rootDir) ? filePath.split(rootDir)[1] : filePath.split('core-backend')[1]
            const modelRelativePath = path.join('../', filePathFromRoot)

            const safePath = modelRelativePath.replace(/\.ts$/, '')

            fileStart += `${importAllAs ? 'import * as' : 'import'} ${fileNameCamelCase} from '${safePath}'\n`
            fileNamesForExport.push(fileNameCamelCase)
            output.push({ fileNameDashCase, fileNameCamelCase, modelRelativePath })
        } catch (err) {
            C.error(`Wrong file type for ${fileType}`, { filePath, originalError: err })
            return output
        }
    }
    const fileContent = generateOutput(fileStart, fileNamesForExport, spread)
    fs.outputFileSync(path.join(generatedFilePathServer, outputFileName), fileContent)
    return output
}

function generateOutputDefault(
    fileStart: string,
    fileNamesForExport: string[],
    isSpreadExport?: boolean
) {
    return `${fileStart}\nexport default { ${(isSpreadExport ? fileNamesForExport.map(x => '...' + x) : fileNamesForExport).join(', ')} }`
}