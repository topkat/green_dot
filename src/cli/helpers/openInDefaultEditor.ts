/* eslint-disable no-console */
import { spawn } from 'child_process'
import { exec } from 'child_process'
import fs from 'fs'
import { luigi } from './luigi.bot'
import { C } from 'topkat-utils'

/**
 * Opens a file in VS Code if available, otherwise in the system's default editor.
 */
export function openInDefaultEditor(absolutePath: string): void {
  try {
    spawn('code', ['--reuse-window', '--goto', absolutePath], {
      detached: true,
      stdio: 'ignore',
    }).unref()

    luigi.warn(`Known issue:` + C.dim(` if the file is not openning in your main editor it may be because a program changed your path to the code command. If you are in VSCode or Cursor IDE, press F1 and search for "Install code command in path" `))

    return
  } catch {
    console.warn('Could not determine `code` path. Searching for VS Code...')
  }

  // 🎯 Try to locate VS Code manually
  const vsCodePaths = [
    '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code', // macOS
    process.env.LOCALAPPDATA + '\\Programs\\Microsoft VS Code\\Code.exe', // Windows
    '/usr/share/code/bin/code', // Linux
    '/usr/bin/code', // Alternative Linux
  ].filter(Boolean) as string[]

  for (const vsCodePath of vsCodePaths) {
    if (fs.existsSync(vsCodePath)) {
      console.log('Found VS Code at:', vsCodePath)
      spawn(vsCodePath, ['--reuse-window', '--goto', absolutePath], {
        detached: true,
        stdio: 'ignore',
      }).unref()
      return
    }
  }

  console.warn('VS Code not found, using system default editor...')

  // 🖥️ Open in default system editor as last fallback
  const openCmd =
    process.platform === 'win32'
      ? 'start'
      : process.platform === 'darwin'
        ? 'open'
        : 'xdg-open'

  exec(`${openCmd} "${absolutePath}"`)
}