import { sep } from 'path'

export function ensureDistFolderInFilePath(path: string) {
  return path.replace(new RegExp(`(${sep}dist)?${sep}src`), `${sep}dist${sep}src`)
}