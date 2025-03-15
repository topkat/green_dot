import Path from 'path'
import fs from 'fs-extra'
import { app } from 'command-line-application'
import { cliPrompt } from 'simple-cli-prompt'
import { round2, C, objEntries, pushIfNotExist, randomItemInArray, timeout } from 'topkat-utils'
import { execWaitForOutput } from 'topkat-utils/backend'
import axios from 'axios'

import { generateSdkFiles } from './generateSdkFiles'
import { generateSdkFolderFromTemplates } from './generateSdkFolderFromTemplates'
import { GenerateSDKparamsForService } from '../../types/generateSdk.types'
import { getMainConfig, makeApiCall } from '../..'
import { generateSDKconfigForDaos } from './generateSDKconfigForDao'
import { generateModelFolderInSdk } from './generateModelFolderInSdk'
import { createDaoRouteConfigPerPlatformForSdk } from './generateSDKgetRouteConfigs'
import { getAppConfigs } from '../../helpers/getGreenDotConfigs'


const start = Date.now()

const { prod = false, onlyDefaults = false } = app({
    name: 'generateSdk',
    description: 'Generate backend SDKs',
    examples: ['generateSdk'],
    options: [{
        name: 'prod',
        type: Boolean,
    }, {
        name: 'onlyDefaults',
        type: Boolean,
    }]
}) as { prod: boolean, onlyDefaults: boolean }

export async function run() {

    const mainConfig = getMainConfig()
    const { generateSdkConfig, platforms } = mainConfig

    if (!generateSdkConfig?.enable) return

    try {

        const monorepoRoot = mainConfig.folderPath
        const sdkRoot = Path.resolve(monorepoRoot, './SDKs')
        const appConfigs = getAppConfigs()

        // REBUILD DEFAULT FOLDER
        for (const platform of platforms) {
            const sdkRootPath = Path.join(sdkRoot, `${platform}Sdk`)
            await generateSdkFolderFromTemplates(platform, sdkRootPath)
            await generateModelFolderInSdk(monorepoRoot, platform)
        }

        if (onlyDefaults) {
            return C.success(`Finished generating default files for SDKs in ${round2((Date.now() - start) / 1000)}s`)
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
            //  ╚══╝ ╩  ╩ ╚══╝   ╚══╝ ╩  ╩   ╩   ╩  ╩

            const daoRoutesObject = await createDaoRouteConfigPerPlatformForSdk()
            const daoSdkParamsForPlatform = await generateSDKconfigForDaos(daoRoutesObject)

            //  ╦╗╔╦ ╔══╗ ╔══╗ ╔══╗ ╔══╗   ╔═╗  ╔══╗ ══╦══ ╔══╗
            //  ║╚╝║ ╠═   ╠═╦╝ ║ ═╦ ╠═     ║  ║ ╠══╣   ║   ╠══╣
            //  ╩  ╩ ╚══╝ ╩ ╚  ╚══╝ ╚══╝   ╚══╝ ╩  ╩   ╩   ╩  ╩

            for (const platform of platforms) {

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
                    monorepoRoot,
                    platform,
                    methodConfigAll,
                    servicesMethodsMerged,
                    objectTsMerged,
                    allMethodNamesMerged,
                    backendProjectPerSdk,
                    queriesToInvalidateShared,
                )
            }
        }

        const { npmPublishPromptConfig, notifyOnTelegramPrompt } = generateSdkConfig

        if (!prod && npmPublishPromptConfig && npmPublishPromptConfig.enable) {

            //  ╔═╗  ╦  ╦ ╦╗╔╦ ╔══╗   ╔═══ ╔═╗  ╦ ╔  ╔═══
            //  ╠═╩╗ ║  ║ ║╚╝║ ╠══╝   ╚══╗ ║  ║ ╠═╩╗ ╚══╗
            //  ╚══╝ ╚══╝ ╩  ╩ ╩      ═══╝ ╚══╝ ╩  ╚ ═══╝

            const sizeAfter = {} as Record<string, SizePerFolders>

            for (const platform of platforms) {
                const sdkRootPath = Path.join(sdkRoot, `${platform}Sdk`)
                sizeAfter[platform] = await folderJsFileSizes(sdkRootPath)
            }

            const changedSdks = [] as [platform: string, oldVersion: string, newVersion: string][]

            let noToAll = false
            let packageHasBeenPublished = false
            let yesToAll = false
            let commitWarning = false

            for (const platform of platforms) {

                const sdkRootPath = Path.join(sdkRoot, `${platform}Sdk`)
                const packageJsonPath = Path.join(sdkRootPath, 'package.json')
                if (!fs.existsSync(packageJsonPath)) continue

                const fileSizePath = Path.join(sdkRootPath, 'fileSizes.json')
                const fileSizeContent = fs.existsSync(fileSizePath) ? await fs.readFile(fileSizePath, 'utf-8') : '{}'
                const sizeBefore = JSON.parse(fileSizeContent)

                for (const [fileName, size] of objEntries(sizeAfter[platform])) {
                    const after = size
                    const before = sizeBefore?.[fileName]

                    if (before !== after) {

                        let resp = yesToAll ? 'YES to ONE' : await cliPrompt({
                            message: `A change in the ${platform} SDK has been detected. Would you like to publish the package ?`,
                            choices: ['NO to ALL', 'YES to ALL', 'NO to ONE', 'YES to ONE', 'Ask shouldIpublishMyPackage-Gpt'],
                        })

                        if (resp === 'NO to ALL') {
                            noToAll = true
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

                            const sdkPathRelative = Path.relative(monorepoRoot, sdkRootPath)

                            await fs.writeFile(packageJsonPath, packageJsonAsString.replace(/"version": "[^"]+"/, `"version": "${newVersion}"`))

                            const npmLoginCommand = `npm config set "//registry.npmjs.org/:_authToken=${npmPublishPromptConfig.npmAccessTokenForPublish}" && npm config set registry "https://registry.npmjs.org"`

                            await execWaitForOutput(`${npmLoginCommand} && cd ${sdkPathRelative} && npm publish`, {
                                nbSecondsBeforeKillingProcess: 300,
                                stringOrRegexpToSearchForConsideringDone: 'npm notice Publishing to https://registry.npmjs.org/',
                            })

                            changedSdks.push([platform, packageJson.version, newVersion])

                            // WRITE NEW FILE SIZES
                            await fs.outputFile(fileSizePath, JSON.stringify(sizeAfter[platform]))

                            packageHasBeenPublished = true
                        }
                        break
                    }
                }

                if (noToAll) break
            }

            if (changedSdks.length && packageHasBeenPublished) {

                const changedSdkMessage = changedSdks.map(([platform, oldVersion, newVersion]) => `\n * ${platform}Sdk: ${oldVersion} => ${newVersion}`)

                await execWaitForOutput(`git add -A`)

                await execWaitForOutput(`cd ${monorepoRoot || '.'} && git commit -m "New SDKs versions: ${changedSdkMessage}"`, {
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

        C.success(`SDK generated in ${round2((Date.now() - start) / 1000)}s`)
    } catch (e) {
        C.error(e)
        C.warning(false, 'IF YOU ARE NOT SURE WHY THE BUILD HAS ERRORS, PLEASE RUN THE "NPM RUN CLEAN" COMMAND')
    }

}

run().then(() => {
    process.exit()
})



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

// getLatestVersion('lodash').then(console.log) // Output: 4.17.21