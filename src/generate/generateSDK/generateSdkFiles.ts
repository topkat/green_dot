
import fs from 'fs-extra'
import Path, { dirname } from 'path'
import { displayObjectClean } from '../helpers/displayObjectClean.js'
import { generateSdkFolderFromTemplates } from './generateSdkFolderFromTemplates.js'
import { GenerateSDKparamsForDao, AllMethodsObjectForSdk } from '../../types/generateSdk.types.js'
import { getMainConfig } from '../../helpers/getGreenDotConfigs.js'
import { generateIndexForDbTypeFiles } from '../../cli/build/generateIndexForDbIndex.js'
import { commonJsTsConfig, compileTypeScriptProject, esmModuleTsConfig } from '../../helpers/tsCompiler.js'
import { generateFilesForCachedDb } from '../../cli/build/generateFilesForCachedDb.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dirNameBase = __dirname.replace(Path.sep + 'dist' + Path.sep, Path.sep)

export async function generateSdkFiles(
    sdkRoot: string,
    platform: string,
    daoMethods: GenerateSDKparamsForDao[string]['methodConfigAll'],
    servicesMethods: { [serviceName: string]: { server: string, route: string } },
    objectTs: Record<string, string>,
    allMethodNames: string[],
    backendProjectForSdk: string[],
    queriesToInvalidate: { [query: string]: string[] }
) {

    const { platforms, generateSdkConfig, folderPath: rootPath } = getMainConfig()

    const allMethodsObjectForSdk = { service: servicesMethods, ...daoMethods } satisfies AllMethodsObjectForSdk

    const tsApiTypes = displayObjectClean({
        service__COMMENT__: `// SERVICES ${'='.repeat(30)}`,
        ...objectTs
    })
        .replace(/^(\s+[^(]*?): ([(<])/gm, '$1$2') // replace salesGetAll: ( => salesGetAll(
        .replace(/{/, '')
        .replace(/}\s*$/, '')

    //----------------------------------------
    // POPULATE SDK FOLDER
    //----------------------------------------
    await generateSdkFolderFromTemplates(platform, sdkRoot, platforms, generateSdkConfig, allMethodsObjectForSdk, tsApiTypes, allMethodNames, backendProjectForSdk, queriesToInvalidate)

    //----------------------------------------
    // DATABASE TYPES EMBEDDED IN SDK
    //----------------------------------------
    const databaseFilePath = Path.resolve(dirNameBase, '../../databases/mongo/types/mongoDbBaseTypes.ts')

    const indexFile = await generateFilesForCachedDb(false, Path.join(sdkRoot, ''))

    await Promise.all([
        generateIndexForDbTypeFiles(indexFile, {
            outputFolder: sdkRoot,
            outputFileNameWithoutExtension: 'modelTypes.generated',
            hardCodePermissionFields: true,
        }),
        // mongodbBaseTypes.generated.ts
        copyFile(databaseFilePath, 'mongodbBaseTypes.generated.ts', false, sdkRoot, str => str.replace(/.*\/\/ rmv.*/g, ''))
    ])


    // TODO add ability to embbed custom files in SDK (compiled at build time dynamically ?)
    if (generateSdkConfig.injectFolderInSdk) {

        const folders = [...(generateSdkConfig.injectFolderInSdk.all || []), ...(generateSdkConfig.injectFolderInSdk[platform] || [])]

        for (const folder of folders) {
            const absolute = Path.join(rootPath, folder)

            if (!await fs.exists(absolute)) {
                throw new Error('Provided path in mainConfig.generateSdkConfig.injectFolderInSdk does not exist: ' + absolute)
            }

            const lastBit = absolute.split(Path.sep).pop()

            // await compileTypeScriptProject({
            //     tsConfig: commonJsTsConfig,
            //     projectPath: absolute,
            //     outputPath: Path.join(sdkRoot, lastBit, 'cjs'),
            // })

            await compileTypeScriptProject({
                tsConfig: esmModuleTsConfig,
                projectPath: absolute,
                outputPath: Path.join(sdkRoot, lastBit, 'mjs'),
            })
        }
    }
}



//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝

async function copyFile(
    from: string,
    to = from.replace(/^.*\/([^/]+$)/, '$1'),
    isEs6Import: boolean,
    sdkFolderPath: string,
    replaceInFileStr = (str: string) => str
) {
    let fileAsStr = await fs.readFile(from, 'utf-8')
    if (isEs6Import) {
        fileAsStr = fileAsStr.replace(/%%%!isEs6Import .*/g, '').replace(/%%%isEs6Import /g, '')
    } else {
        let fileAsStrMjs = fileAsStr.replace(/%%%!isEs6Import .*/g, '').replace(/%%%isEs6Import /g, '')
        fileAsStrMjs = replaceInFileStr(fileAsStrMjs)
        await fs.outputFile(Path.join(sdkFolderPath, to.replace('.js', '.mjs')), fileAsStrMjs)
        fileAsStr = fileAsStr.replace(/%%%isEs6Import .*/g, '').replace(/%%%!isEs6Import /g, '')
    }
    fileAsStr = replaceInFileStr(fileAsStr)
    await fs.outputFile(Path.join(sdkFolderPath, to), fileAsStr)
}