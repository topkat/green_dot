#!/usr/bin/env ts-node

import path from 'path'
import fs from 'fs-extra'
import { generateImportMappingFile } from '../src/generate/helpers/generateImportMappingFile'
import { generateEnvFile } from '../src/generate/generateEnvFile'

import { C } from 'topkat-utils'

(process.env as any).NODE_ENV = 'build'

export async function cleanGeneratedFiles() {
  try {
    const serverGeneratedPath = path.resolve(process.cwd(), `./src/2_generated`)

    //----------------------------------------
    // CLEAN GENERATED FILES
    //----------------------------------------
    await fs.rm(serverGeneratedPath, { recursive: true })
    await fs.ensureDir(serverGeneratedPath)
    await fs.copy(
      path.join(__dirname, '../src/generate/backendGeneratedDefaults'),
      serverGeneratedPath
    )
    C.success('Generated files reset')

    //----------------------------------------
    // GENERATE FILES
    //----------------------------------------
    generateImportMappingFile(serverGeneratedPath, `.error.ts`, `errors.generated.ts`, { spread: true, fileStartBase: `import { allCoreErrors } from '@core-backend'\n`, fileNamesForExport: ['allCoreErrors'] })
    generateImportMappingFile(serverGeneratedPath, `.{svc,cron}.ts`, `services.generated.ts`, { importAllAs: true })
    generateImportMappingFile(serverGeneratedPath, `.test-flow.ts`, `test-flows.generated.ts`, { fileStartBase: `import { coreTestFlows } from '@core-backend'\n`, fileNamesForExport: ['coreTestFlows'] })

    C.success('Services, testFlows, errors files generated')

    await generateEnvFile(serverGeneratedPath)

    process.exit(0)

  } catch (e) {
    C.error(e)
  }
}

cleanGeneratedFiles()