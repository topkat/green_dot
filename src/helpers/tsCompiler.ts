import * as ts from 'typescript'
import fs from 'fs-extra'
import Path from 'path'

export async function compileTypeScriptToFile(
  sourceCode: string,
  outputPath: string,
  options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  }
): Promise<void> {
  // Create a source file
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    sourceCode,
    ts.ScriptTarget.ES2020,
    true
  )

  // Create a program
  const program = ts.createProgram(['temp.ts'], options)

  // Get the emit output
  const emitResult = program.emit()

  // Check for compilation errors
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  if (allDiagnostics.length > 0) {
    const errors = allDiagnostics.map(diagnostic => {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        return `Error ${line + 1},${character + 1}: ${message}`
      } else {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      }
    })
    throw new Error(`TypeScript compilation failed:\n${errors.join('\n')}`)
  }

  // Ensure the output directory exists
  await fs.ensureDir(Path.dirname(outputPath))

  // Write the compiled JavaScript to the output file
  const outputFile = outputPath.replace(/\.ts$/, '.js')
  await fs.writeFile(outputFile, emitResult.emittedFiles[0], 'utf-8')

  // If source maps were generated, write them too
  if (emitResult.emittedFiles[1]) {
    await fs.writeFile(outputFile + '.map', emitResult.emittedFiles[1], 'utf-8')
  }
}

export async function compileTypeScriptToMemory(
  sourceCode: string,
  options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  }
): Promise<string> {
  // Create a source file
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    sourceCode,
    ts.ScriptTarget.ES2020,
    true
  )

  // Create a program
  const program = ts.createProgram(['temp.ts'], options)

  // Get the emit output
  const emitResult = program.emit()

  // Check for compilation errors
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  if (allDiagnostics.length > 0) {
    const errors = allDiagnostics.map(diagnostic => {
      if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        return `Error ${line + 1},${character + 1}: ${message}`
      } else {
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      }
    })
    throw new Error(`TypeScript compilation failed:\n${errors.join('\n')}`)
  }

  return emitResult.emittedFiles[0]
}