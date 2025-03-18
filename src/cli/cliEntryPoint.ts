#!/usr/bin/env ts-node

import { spawn, ChildProcess } from 'child_process'
import { clearCli } from './helpers/cli'


let childProcess: ChildProcess


//  ╦╗╔╦ ╔══╗ ═╦═ ╦╗ ╔   ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔═══ ╔═══   ╔══╗ ═╗╔═ ═╦═ ══╦══
//  ║╚╝║ ╠══╣  ║  ║╚╗║   ╠══╝ ╠═╦╝ ║  ║ ║    ╠═   ╚══╗ ╚══╗   ╠═    ╠╣   ║    ║
//  ╩  ╩ ╩  ╩ ═╩═ ╩ ╚╩   ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ═══╝ ═══╝   ╚══╝ ═╝╚═ ═╩═   ╩
process.on('SIGINT', handleMainProcessExit)
process.on('SIGTERM', handleMainProcessExit)

function handleMainProcessExit() {
  process.stdout.write('\nShutting down process gracefully...\n')
  if (childProcess) childProcess.kill()
  process.exit()
}



//  ╔═══ ══╦══ ╔══╗ ╔══╗ ══╦══   ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔═══ ╔═══
//  ╚══╗   ║   ╠══╣ ╠═╦╝   ║     ╠══╝ ╠═╦╝ ║  ║ ║    ╠═   ╚══╗ ╚══╗
//  ═══╝   ╩   ╩  ╩ ╩ ╚    ╩     ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ═══╝ ═══╝

function startProcess(script: string, args: string[]) {

  if (childProcess) childProcess.kill()

  childProcess = spawn(script, args, {
    stdio: 'inherit', // Inherit main process I/O
  })

  childProcess.on('exit', code => {
    if (code !== 0) {
      if (code === 4) { // error in build command
        process.exit(1)
      } else { // error in application
        clearCli()
        startProcess(script, args)
      }
    }
  })
}

const [tsNodePath, , ...args] = process.argv

startProcess(tsNodePath, [__dirname + '/dot.command.ts', ...args])
