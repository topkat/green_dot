
import fs from 'fs-extra'
import Path from 'path'
import { displayObjectClean } from '../helpers/displayObjectClean'
import { generateSdkFolderFromTemplates } from './generateSdkFolderFromTemplates'
import { GenerateSDKparamsForDao, AllMethodsObjectForSdk } from '../../types/generateSdk.types'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { generateIndexForDbTypeFiles } from '../../cli/build/generateIndexForDbTypeFiles'

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

    const { platforms, generateSdkConfig } = getMainConfig()

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

    await Promise.all([
        generateIndexForDbTypeFiles({
            outputFolder: sdkRoot,
            outputFileNameWithoutExtension: 'modelTypes.generated'
        }),
        // mongodbBaseTypes.generated.ts
        copyFile(databaseFilePath, 'mongodbBaseTypes.generated.ts', false, sdkRoot, str => str.replace(/.*\/\/ rmv.*/g, ''))
    ])


    // TODO add ability to embbed custom files in SDK (compiled at build time dynamically ?)

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