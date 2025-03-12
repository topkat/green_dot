
import Path from 'path'
import fs from 'fs'
import { generateModelTypes } from '../generate/generateModelTypes'

// TODO DELETEME
export async function generateDbTypes() {
  const generatedFilePathServer = Path.resolve(process.cwd(), `./src/2_generated`)

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
}