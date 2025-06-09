import Path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function fromGreenDotFolderRoot(path: string = '') {
  const relative = __dirname.includes('dist') ? '../../../../' : '../../../'
  return Path.join(Path.resolve(__dirname, relative), path)
}