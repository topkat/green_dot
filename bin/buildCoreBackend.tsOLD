#!/usr/bin/env ts-node

import path from 'path'
import { app } from 'command-line-application'
import { execWaitForOutput } from 'topkat-utils/backend'

import { C, round2 } from 'topkat-utils'

(process.env as any).NODE_ENV = 'build'

const start = Date.now()
//----------------------------------------
// CLI CONFIG
//----------------------------------------
const buildCoreBackend = {
    name: 'buildCoreBackend',
    description: 'Pre build backend',
    examples: ['buildCoreBackend'],
}

app(buildCoreBackend)

//----------------------------------------
// PREBUILD SERVER
//----------------------------------------
async function preBuildServer() {
    try {
        //----------------------------------------
        // GENERATE AND CLEAN FILES
        //----------------------------------------
        /** /!\ file generation needs to be in another process since we can't refresh
        import cache and so imported files will be the wrong ones (not generated) */
        await execWaitForOutput(
            `bun ${path.resolve(__dirname, './cleanAndGenerateFiles.ts').replace(/ /g, '\\ ')}`, {
            nbSecondsBeforeKillingProcess: 60,
            stringOrRegexpToSearchForConsideringDone: 'FILES GENERATED SUCCESSFULLY'
        })

        //----------------------------------------
        // BUILD SERVER
        //----------------------------------------
        const configFullPath = path.join(process.cwd(), '/src/1_shared/appConfig')

        const { generateMainBackendFiles, updateServerConfig } = await import('../src/generate/generateMainBackendFiles')

        const genConf = await import(configFullPath)
        const serverConfig = genConf.coreBackendConfig

        updateServerConfig(serverConfig)

        await generateMainBackendFiles()

        return true
    } catch (e) {
        C.error(e)
        C.warning(false, '/!\\ PLEASE READ CARREFULLY /!\\\n => if you are not sure why the build has error, please run the "npm run clean" command\n => You can also run build of projects independently, the order of builds may depends on files you are modifying')
    }
}

preBuildServer().then(val => {
    if (val) {
        C.success(`BACKEND builded in ${round2((Date.now() - start) / 1000)}s`)
        process.exit(0)
    } else {
        C.error(false, `BACKEND builded with errors`)
        process.exit(1)
    }
})