import * as ts from 'typescript'
import fs from 'fs-extra'
import Path from 'path'

interface CompileOptions {
  tsConfigPath?: string
  projectPath: string
  outputPath?: string
  customOptions?: ts.CompilerOptions
}

export async function compileTypeScriptProject(options: CompileOptions): Promise<string> {

  const { tsConfigPath: tsConfigPath2, projectPath, outputPath, customOptions } = options

  // Read and parse tsconfig.json
  const tsConfigPath = Path.join(tsConfigPath2 || projectPath, 'tsconfig.json')
  const tsConfigExists = await fs.pathExists(tsConfigPath)

  if (!tsConfigExists) {
    throw new Error(`tsconfig.json not found in ${projectPath}`)
  }

  const tsConfigContent = await fs.readFile(tsConfigPath, 'utf-8')
  const tsConfig = ts.parseConfigFileTextToJson(tsConfigPath, tsConfigContent)

  if (tsConfig.error) {
    throw new Error(`Error parsing tsconfig.json: ${tsConfig.error.messageText}`)
  }

  // Parse compiler options
  const parsedConfig = ts.parseJsonConfigFileContent(
    tsConfig.config,
    ts.sys,
    projectPath
  )

  // Merge custom options if provided
  const compilerOptions: ts.CompilerOptions = {
    ...parsedConfig.options,
    ...customOptions,
    outDir: outputPath || parsedConfig.options.outDir
  }

  // Create program with all files in the project
  const program = ts.createProgram(parsedConfig.fileNames, compilerOptions)

  // Get the emit output
  const emitResult = program.emit()

  // Check for compilation errors
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  if (allDiagnostics.length > 0) {
    const errors = allDiagnostics.map(diagnostic => {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        return `Error in ${diagnostic.file.fileName} ${line + 1},${character + 1}: ${message}`
      } else {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      }
    })
    throw new Error(`TypeScript compilation failed:\n${errors.join('\n')}`)
  }

  // Return the output directory path
  return compilerOptions.outDir || projectPath
}
