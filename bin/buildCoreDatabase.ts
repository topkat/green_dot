#!/usr/bin/env ts-node

import path from 'path'
import fs from 'fs-extra'
import { generateImportMappingFile } from '../src/generate/helpers/generateImportMappingFile'
import { app } from 'command-line-application'
import { generateModelTypes } from '../src/generate/generateModelTypes'

import { round2, C } from 'topkat-utils'

(process.env as any).NODE_ENV = 'build'

const start = Date.now()

const buildCoreDatabase = {
    name: 'buildCoreDatabase',
    description: 'Pre build database',
    examples: ['buildCoreDatabase'],
}

app(buildCoreDatabase)

async function run() {
    try {
        // TODO DELETEME this is now used in another file
        const generatedFilePathServer = path.resolve(process.cwd(), `./src/2_generated`)

        //----------------------------------------
        // CLEAN GENERATED FILES
        //----------------------------------------
        const generatedExists = await fs.pathExists(generatedFilePathServer)
        if (generatedExists) await fs.rm(generatedFilePathServer, { recursive: true })
        await fs.ensureDir(generatedFilePathServer)
        await fs.copy(
            path.join(__dirname, '../src/generate/dbFolderGeneratedDefaults'),
            generatedFilePathServer
        )
        C.success(`Cleared generated file folder`)

        //----------------------------------------
        // BUILD MODELS GENERATED
        //----------------------------------------
        const modelFiles = generateImportMappingFile(generatedFilePathServer, `.model.ts`, `models.generated.ts`, {
            generateOutput(fileStart, fileNamesForExport, spread) {
                return `${fileStart}\n\n` +
                    `export type ModelNames = ${fileNamesForExport.map(name => `'${name}'`).join(' | ') || 'never'}\n\n` +
                    `export const models = { ${(spread ? fileNamesForExport.map(x => '...' + x) : fileNamesForExport).join(', ')} }`
            },
        })
        C.success(`Generated model files`)

        generateImportMappingFile(generatedFilePathServer, `.dao.ts`, `dao-configs.generated.ts`)
        C.success(`Generated dao files`)

        await generateModelTypes(modelFiles, generatedFilePathServer)
        C.success(`Generated model types`)

        C.success(`Finished in ${round2((Date.now() - start) / 1000)}s`)
    } catch (e) {
        C.error(e)
        C.warning(false, 'IF YOU ARE NOT SURE WHY THE BUILD HAS ERRORS, PLEASE RUN THE "NPM RUN CLEAN" COMMAND')
    }

    process.exit()
}

run()