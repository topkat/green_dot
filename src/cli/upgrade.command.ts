import Path from 'path'
import { execSync } from 'child_process'
import { C } from 'topkat-utils'
import { readFileSync } from 'fs'
import { getProjectPaths } from '../helpers/getProjectPaths.js'

export async function upgradeCommand() {

  C.info('Upgrading green_dot to the latest version...')

  const { mainConfig } = await getProjectPaths()

  // Get the current package.json path
  const packageJsonPath = Path.join(mainConfig.folderPath, '/package.json')

  // Read the current version
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const currentVersion = packageJson.dependencies?.green_dot || packageJson.devDependencies?.green_dot

  if (!currentVersion) {
    throw new Error('green_dot is not found in your dependencies')
  }

  // Install the latest version
  execSync('yarn install green_dot@latest', { stdio: 'inherit' })

  // Get the new version
  const newPackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const newVersion = newPackageJson.dependencies?.green_dot || newPackageJson.devDependencies?.green_dot

  if (currentVersion === newVersion) {
    C.success('green_dot is already at the latest version')
  } else {
    C.success(`Successfully upgraded green_dot from ${currentVersion} to ${newVersion}`)
  }

}