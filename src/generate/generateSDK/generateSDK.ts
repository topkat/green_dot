import Path from 'path'
import fs from 'fs-extra'
import { cliPrompt } from 'simple-cli-prompt'
import { C, pushIfNotExist, randomItemInArray, timeout } from 'topkat-utils'
import { execWaitForOutput } from 'topkat-utils/backend'
import axios from 'axios'

import { generateSdkFiles } from './generateSdkFiles'
import { generateSdkFolderFromTemplates } from './generateSdkFolderFromTemplates'
import { GenerateSDKparamsForService } from '../../types/generateSdk.types'
import { getMainConfig, makeApiCall } from '../..'
import { generateSDKconfigForDaos } from './generateSDKconfigForDao'
import { createDaoRouteConfigPerPlatformForSdk } from './generateSDKgetRouteConfigs'
import { getAppConfigs } from '../../helpers/getGreenDotConfigs'
import { findProjectPath } from '../../helpers/getProjectPaths'
import { generateIndexForDbTypeFiles } from '../../cli/build/generateIndexForDbTypeFiles'

const sdkFolderName = 'SDKs'


export async function generateSdk(onlyDefaults = false, publishSdk = false) {

    const mainConfig = getMainConfig(true)

    // SAFE MODE (mainly one of the greenDot config is requiring a SDK 🙃)
    if (!mainConfig) return SAFEmode()

    const { isProdEnv, generateSdkConfig, platforms } = mainConfig

    if (!generateSdkConfig?.enable) return

    const repoRoot = mainConfig.folderPath
    const allSdksRoot = Path.resolve(repoRoot, './' + sdkFolderName)
    const appConfigs = getAppConfigs()

    // REBUILD DEFAULT FOLDER
    for (const platform of platforms) {
        const sdkRootPath = Path.join(allSdksRoot, `${platform}Sdk`)
        await generateSdkFolderFromTemplates(platform, sdkRootPath, platforms, generateSdkConfig)
        await generateIndexForDbTypeFiles({
            outputFolder: sdkRootPath,
            outputFileNameWithoutExtension: 'modelTypes.generated'
        })
    }

    if (onlyDefaults) {
        return C.success(`Generated SDK defaults`)
    }

    if (!onlyDefaults) {

        //  ╔═══ ╔══╗ ╔══╗ ╦  ╦ ═╦═ ╔══╗ ╔══╗ ╔═══   ╔═╗  ╔══╗ ══╦══ ╔══╗
        //  ╚══╗ ╠═   ╠═╦╝ ╚╗ ║  ║  ║    ╠═   ╚══╗   ║  ║ ╠══╣   ║   ╠══╣
        //  ═══╝ ╚══╝ ╩ ╚   ╚═╝ ═╩═ ╚══╝ ╚══╝ ═══╝   ╚═╝  ╩  ╩   ╩   ╩  ╩

        const allSdkConfigs = [] as { folder: string, sdkConfig: GenerateSDKparamsForService }[]

        for (const { folderPath, generatedFolderPath } of appConfigs) {

            const sdkConfigFilePath = Path.join(generatedFolderPath, `sdkConfig.generated.json`)
            const sdkConfigFileFound = fs.existsSync(sdkConfigFilePath)

            if (sdkConfigFileFound) {
                const sdkConfig = JSON.parse(await fs.readFile(sdkConfigFilePath, 'utf-8')) as GenerateSDKparamsForService
                allSdkConfigs.push({ folder: folderPath, sdkConfig })
            }
        }

        //  ╔═╗  ╔══╗ ╔══╗   ╔═╗  ╔══╗ ══╦══ ╔══╗
        //  ║  ║ ╠══╣ ║  ║   ║  ║ ╠══╣   ║   ╠══╣
        //  ╚═╝  ╩  ╩ ╚══╝   ╚═╝  ╩  ╩   ╩   ╩  ╩

        const daoRoutesObject = await createDaoRouteConfigPerPlatformForSdk()
        const daoSdkParamsForPlatform = await generateSDKconfigForDaos(daoRoutesObject)

        //  ╦╗╔╦ ╔══╗ ╔══╗ ╔══╗ ╔══╗   ╔═╗  ╔══╗ ══╦══ ╔══╗
        //  ║╚╝║ ╠═   ╠═╦╝ ║ ═╦ ╠═     ║  ║ ╠══╣   ║   ╠══╣
        //  ╩  ╩ ╚══╝ ╩ ╚  ╚══╝ ╚══╝   ╚══╝ ╩  ╩   ╩   ╩  ╩

        for (const platform of platforms) {

            const sdkRootPath = Path.join(allSdksRoot, `${platform}Sdk`)

            const objectTsMerged = {} as { [method: string]: string }
            const servicesMethodsMerged = {} as { [method: string]: [serverKey: string, serviceName: string] }
            const allMethodNamesMerged = [] as string[]
            /** Stores how much different backends are exposed in a single SDK */
            const backendProjectPerSdk = [] as string[]

            const queriesToInvalidateShared = {} as { [query: string]: string[] }

            // SERVICES
            for (const { folder, sdkConfig } of allSdkConfigs) {

                if (!sdkConfig[platform]) continue

                const { objectTs, methodConfigService, serviceMethods, sharedServiceMethods, queriesToInvalidate } = sdkConfig[platform]

                Object.assign(queriesToInvalidateShared, queriesToInvalidate)

                if (serviceMethods.length) backendProjectPerSdk.push(folder)

                const allMethodNames = [...serviceMethods, ...sharedServiceMethods]

                Object.assign(objectTsMerged, objectTs)
                for (const [serviceName, route] of Object.entries(methodConfigService)) {
                    servicesMethodsMerged[serviceName] = [folder, route]
                }
                pushIfNotExist(allMethodNamesMerged, allMethodNames)

            }

            // DAO
            const { allMethodNames, methodConfigAll, objectTs } = daoSdkParamsForPlatform[platform]

            Object.assign(objectTsMerged, objectTs)
            pushIfNotExist(allMethodNamesMerged, allMethodNames)

            //  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╔══╗ ╔══╗ ══╦══ ╔══╗   ╔═══ ╔═╗  ╦ ╔
            //  ║ ═╦ ╠═   ║╚╗║ ╠═   ╠═╦╝ ╠══╣   ║   ╠═     ╚══╗ ║  ║ ╠═╩╗
            //  ╚══╝ ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚  ╩  ╩   ╩   ╚══╝   ═══╝ ╚══╝ ╩  ╚

            await generateSdkFiles(
                sdkRootPath,
                platform,
                methodConfigAll,
                servicesMethodsMerged,
                objectTsMerged,
                allMethodNamesMerged,
                backendProjectPerSdk,
                queriesToInvalidateShared,
            )

            if (!await fs.exists(Path.join('sdkRootPath', 'node_modules'))) {
                C.info(`Installing node_modules for SDK: ${sdkRootPath}`)
                await execWaitForOutput(`cd ${sdkRootPath} && npm i`, { stringOrRegexpToSearchForConsideringDone: /added.*packages/ })
            }
        }
    }

    const { npmPublishPromptConfig, notifyOnTelegramPrompt } = generateSdkConfig

    if (!isProdEnv && publishSdk && npmPublishPromptConfig && npmPublishPromptConfig.enable) {

        //  ╔═╗  ╦  ╦ ╦╗╔╦ ╔══╗   ╔═══ ╔═╗  ╦ ╔  ╔═══
        //  ╠═╩╗ ║  ║ ║╚╝║ ╠══╝   ╚══╗ ║  ║ ╠═╩╗ ╚══╗
        //  ╚══╝ ╚══╝ ╩  ╩ ╩      ═══╝ ╚══╝ ╩  ╚ ═══╝

        const sizeAfter = {} as Record<string, SizePerFolders>

        for (const platform of platforms) {
            const sdkRootPath = Path.join(allSdksRoot, `${platform}Sdk`)
            sizeAfter[platform] = await folderJsFileSizes(sdkRootPath)
        }

        const changedSdks = [] as [platform: string, oldVersion: string, newVersion: string][]

        let packageHasBeenPublished = false
        let yesToAll = false
        let commitWarning = false

        for (const platform of platforms) {

            const sdkRootPath = Path.join(allSdksRoot, `${platform}Sdk`)
            const packageJsonPath = Path.join(sdkRootPath, 'package.json')
            if (!fs.existsSync(packageJsonPath)) continue

            let resp = yesToAll ? 'YES to ONE' : await cliPrompt({
                message: `A change in the ${platform} SDK has been detected. Would you like to publish the package ?`,
                choices: ['NO to ALL', 'YES to ALL', 'NO to ONE', 'YES to ONE', 'Ask shouldIpublishMyPackage-Gpt'],
            })

            if (resp === 'NO to ALL') {
                break
            } else if (resp === 'Ask shouldIpublishMyPackage-Gpt') {
                const shouldPublish = randomItemInArray(['Yes', 'No'] as const)

                C.info('Searching the web...')
                await timeout(1500)
                C.info('The response is...')
                await timeout(800)
                C.log(`${shouldPublish === 'Yes' ? C.green('"YES"') : C.red('"NO"')} Your package should ${shouldPublish === 'Yes' ? '' : 'NOT '}be published!\n\n`)

                const resp2 = await cliPrompt({
                    message: `Would you like to follow shouldIpublishMyPackage-Gpt recomandations?`,
                    choices: ['Yes', 'No'],
                })

                if (resp2 === 'No') {
                    C.error(false, `ARE YOU KIDDING ME?? I fried my processors to answer your fucking question, consuming the yearly electricity of 5 people, and you don’t follow my genius recommendation...\n\n`)
                    await timeout(900)
                    C.error(false, 'Good....\n\n\n')
                    await timeout(1000)
                    C.error(false, 'BYE....\n\n\n')
                    process.exit()
                } else resp = shouldPublish === 'Yes' ? 'YES to ONE' : 'NO to ONE'
            }

            if (resp === 'YES to ONE' || resp === 'YES to ALL') {
                if (resp === 'YES to ALL') yesToAll = true

                const packageJsonAsString = await fs.readFile(Path.join(sdkRootPath, 'package.json'), 'utf-8')
                const packageJson = JSON.parse(packageJsonAsString)
                const realNpmVersion = await getLatestVersion(packageJson.name)

                const newVersion = realNpmVersion
                    .split('.')
                    .map((n, i) => i === 2 ? parseInt(n) + 1 : n) // PATCH VERSION
                    .join('.')

                C.info(`Ready to bump "${platform}Sdk" from ${packageJson.version} to ${newVersion} 🚀`)

                if (!commitWarning) {
                    await cliPrompt({
                        message: `Please COMMIT your changes so a special commit with the new changes can be done`,
                        confirm: true,
                    })
                    commitWarning = true
                }

                const sdkPathRelative = Path.relative(repoRoot, sdkRootPath)

                await fs.writeFile(packageJsonPath, packageJsonAsString.replace(/"version": "[^"]+"/, `"version": "${newVersion}"`))

                const npmLoginCommand = `npm config set "//registry.npmjs.org/:_authToken=${npmPublishPromptConfig.npmAccessTokenForPublish}" && npm config set registry "https://registry.npmjs.org"`

                await execWaitForOutput(`${npmLoginCommand} && cd ${sdkPathRelative} && npm publish`, {
                    nbSecondsBeforeKillingProcess: 300,
                    stringOrRegexpToSearchForConsideringDone: 'npm notice Publishing to https://registry.npmjs.org/',
                })

                changedSdks.push([platform, packageJson.version, newVersion])

                packageHasBeenPublished = true
            }
        }

        if (changedSdks.length && packageHasBeenPublished) {

            const changedSdkMessage = changedSdks.map(([platform, oldVersion, newVersion]) => `\n * ${platform}Sdk: ${oldVersion} => ${newVersion}`)

            await execWaitForOutput(`git add -A`)

            await execWaitForOutput(`cd ${repoRoot || '.'} && git commit -m "New SDKs versions: ${changedSdkMessage}"`, {
                nbSecondsBeforeKillingProcess: 300,
                stringOrRegexpToSearchForConsideringDone: 'file changed',
            })

            await timeout(2000) // avoid log mess

            if (notifyOnTelegramPrompt) {

                const resp = await cliPrompt({
                    message: `Would you like to notify the team about the new packages published ?`,
                    choices: ['Yes', 'No'],
                })

                if (resp === 'Yes') {
                    await makeApiCall(null, `https://api.telegram.org/${notifyOnTelegramPrompt.botId}/sendMessage`, {
                        body: { chat_id: notifyOnTelegramPrompt.chatId, text: `Hi! Some packages have been updated to new version: ${changedSdkMessage}` }
                    })
                }
            }

            C.info(changedSdkMessage)
        }
    }

    C.success(`Generated SDK defaults`)

}




//  ╔═══ ╔══╗ ╔══╗ ╔══╗   ╦╗╔╦ ╔══╗ ╔═╗  ╔══╗
//  ╚══╗ ╠══╣ ╠═   ╠═     ║╚╝║ ║  ║ ║  ║ ╠═
//  ═══╝ ╩  ╩ ╩    ╚══╝   ╩  ╩ ╚══╝ ╚══╝ ╚══╝
// This mode helps generating defaults generic SDKs to avoid type error
// on intermediate build, the it reconstruct everything with right types

async function SAFEmode() {

    C.warning(false, 'Error: trying generating SDKs. Will retry now in safe mode.')

    const { rootPath } = await findProjectPath()

    const sdkRoot = Path.resolve(rootPath, './' + sdkFolderName)

    if (await fs.exists(sdkRoot)) {

        const sdkPaths = (await fs.readdir(sdkRoot)).filter(name => name.includes('Sdk'))

        const getPlatformFromPath = sdkPath => sdkPath.split(Path.sep).pop().replace('Sdk', '')
        const platforms = sdkPaths.map(sdkPath => getPlatformFromPath(sdkPath))

        for (const sdkPath of sdkPaths) {
            const platform = getPlatformFromPath(sdkPath)
            const sdkAbsPath = Path.join(sdkRoot, sdkPath)

            await generateSdkFolderFromTemplates(platform, sdkAbsPath, platforms)
            await generateIndexForDbTypeFiles({
                outputFolder: sdkAbsPath,
                outputFileNameWithoutExtension: 'modelTypes.generated'
            })
        }

        return C.success(`Generated SDK SAFE`)
    }
}


//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝


type SizePerFolders = { [fileName: string]: number }

async function folderJsFileSizes(
    baseDir: string
) {
    const fileSizes: SizePerFolders = {}

    if (await fs.exists(baseDir)) {
        const items = await fs.readdir(baseDir, { recursive: true })
        const jsFiles = items.filter(e => typeof e === 'string' && isJsFile(e)) as string[]

        for (const path of jsFiles) {
            const fullPath = Path.join(baseDir, path)
            const stats = await fs.stat(fullPath)
            fileSizes[fullPath] = stats.size
        }
    }

    return fileSizes
}

function isJsFile(fileName: string) {
    return /\.([m|c]?js|ts)$/.test(fileName)
}


async function getLatestVersion(packageName) {
    const url = `https://registry.npmjs.org/${packageName}`
    const response = await axios.get(url)
    return response.data['dist-tags'].latest
}