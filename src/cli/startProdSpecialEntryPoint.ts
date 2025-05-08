#!/usr/bin/env node

import { C } from 'topkat-utils'
import { getProjectPaths } from '../helpers/getProjectPaths'

export async function startServerProd() {
  //  ╔═══ ══╦══ ╔══╗ ╔══╗ ══╦══   ╔══╗ ╔══╗ ╔══╗ ╔═╗
  //  ╚══╗   ║   ╠══╣ ╠═╦╝   ║     ╠══╝ ╠═╦╝ ║  ║ ║  ║
  //  ═══╝   ╩   ╩  ╩ ╩ ╚    ╩     ╩    ╩ ╚  ╚══╝ ╚══╝

  const { activeApp } = await getProjectPaths()

  if (!activeApp) {
    throw new Error('Please start the process in a green_dot.app folder (folder containing green_dot.APP.config.ts)')
  }

  const { startServer, stopServer } = await import('green_dot' as any)

  const errorHandler = async err => {
    C.error(err)
    await stopServer()

    process.exit(1)
  }

  // Catch All App Errors, even the unhandled ones
  process.on('unhandledRejection', errorHandler)
  process.on('uncaughtException', errorHandler)

  try {
    await startServer()
  } catch (err) {
    errorHandler(err)
  }
}

startServerProd()