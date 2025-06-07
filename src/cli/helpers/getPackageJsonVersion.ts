import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function readPackageJson(path: string) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch (error) {
    return null
  }
}

// Try both possible paths for package.json
const packageJson = readPackageJson(join(__dirname, '../../../package.json')) ||
  readPackageJson(join(__dirname, '../../../../package.json'))

if (!packageJson) {
  throw new Error('Could not find package.json in either expected location')
}

const { version } = packageJson

export function getPackageJsonVersion() {
  return version
}

