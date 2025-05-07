// #!/usr/bin/env bun

import '../types/global.types'
import { startProdServerCommand } from './startProdServer.command'

export async function startTask() {

  await startProdServerCommand()

}

startTask()