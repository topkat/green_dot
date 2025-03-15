#!/usr/bin/env ts-node

import path from 'path'
import fs from 'fs-extra'
import { generateImportMappingFile } from '../src/generate/helpers/generateImportMappingFile'
import { generateEnvFile } from '../src/generate/generateEnvFile'
import { getActiveAppConfig } from '../src/helpers/getGreenDotConfigs'

import { C } from 'topkat-utils'

(process.env as any).NODE_ENV = 'build'

export async function cleanGeneratedFiles() {
  try {

    const { generatedFolderPath } = getActiveAppConfig()

    //----------------------------------------
    // CLEAN GENERATED FILES
    //----------------------------------------
    await fs.rm(generatedFolderPath, { recursive: true })
    await fs.ensureDir(generatedFolderPath)
    await fs.copy(
      path.join(__dirname, '../src/generate/backendGeneratedDefaults'),
      generatedFolderPath
    )
    C.success('Generated files reset')

    //----------------------------------------
    // GENERATE FILES
    //----------------------------------------
    generateImportMappingFile(generatedFolderPath, `.error.ts`, `errors.generated.ts`, { spread: true, fileStartBase: `import { allCoreErrors } from '@core-backend'\n`, fileNamesForExport: ['allCoreErrors'] })
    generateImportMappingFile(generatedFolderPath, `.{svc,cron}.ts`, `services.generated.ts`, { importAllAs: true })
    generateImportMappingFile(generatedFolderPath, `.test-flow.ts`, `test-flows.generated.ts`, { fileStartBase: `import { coreTestFlows } from '@core-backend'\n`, fileNamesForExport: ['coreTestFlows'] })

    C.success('Services, testFlows, errors files generated')

    await generateEnvFile(generatedFolderPath)

    process.exit(0)

  } catch (e) {
    C.error(e)
  }
}

cleanGeneratedFiles()