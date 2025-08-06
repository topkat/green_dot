import * as ts from 'typescript'
import fs from 'fs-extra'
import Path from 'path'

interface CompileOptions {
  tsConfig?: string | ts.ParsedCommandLine
  projectPath: string
  outputPath?: string
  customOptions?: ts.CompilerOptions
}

export async function compileTypeScriptProject(options: CompileOptions): Promise<string> {
  const { tsConfig, projectPath, outputPath, customOptions } = options

  let parsedConfig: ts.ParsedCommandLine

  if (typeof tsConfig === 'string') {
    // If tsConfig is already a ParsedCommandLine object, use it directly

    const tsConfigJson = ts.parseConfigFileTextToJson('', tsConfig)

    if (tsConfigJson.error) {
      throw new Error(`Error parsing tsconfig.json: ${tsConfigJson.error.messageText}`)
    }

    parsedConfig = ts.parseJsonConfigFileContent(
      tsConfigJson.config,
      ts.sys,
      projectPath
    )
  } else {
    // Fallback to projectPath if no tsConfig is provided
    const tsConfigPath = Path.join(projectPath, 'tsconfig.json')
    const tsConfigExists = await fs.pathExists(tsConfigPath)

    if (!tsConfigExists) {
      throw new Error(`tsconfig.json not found in ${projectPath}`)
    }

    const tsConfigContent = await fs.readFile(tsConfigPath, 'utf-8')

    const tsConfigJson = ts.parseConfigFileTextToJson(tsConfigPath, tsConfigContent)

    if (tsConfigJson.error) {
      throw new Error(`Error parsing tsconfig.json: ${tsConfigJson.error.messageText}`)
    }

    parsedConfig = ts.parseJsonConfigFileContent(
      tsConfigJson.config,
      ts.sys,
      projectPath
    )
  }

  // Merge custom options if provided
  const compilerOptions: ts.CompilerOptions = {
    esModuleInterop: true,
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



const toMergeTsConfig = {
  'rootDir': '.',
  'declaration': true,
  'noImplicitAny': false,
  'noImplicitThis': true,
  'esModuleInterop': true,
  'resolveJsonModule': true,
  'allowSyntheticDefaultImports': true,
  'forceConsistentCasingInFileNames': true,
  'strict': false,
  'skipLibCheck': true,
}

export const commonJsTsConfig = JSON.stringify({
  'compilerOptions': {
    'module': 'CommonJS',
    'target': 'ES2020',
    'moduleResolution': 'node',
    'esModuleInterop': true,
    ...toMergeTsConfig
  },
  'include': ['.']
}, null, 2)

export const esmModuleTsConfig = JSON.stringify({
  'compilerOptions': {
    'module': 'nodenext',
    'target': 'ES2022',
    'moduleResolution': 'nodenext',
    'esModuleInterop': true,
    ...toMergeTsConfig,
  },
  'include': ['.']
}, null, 2)
