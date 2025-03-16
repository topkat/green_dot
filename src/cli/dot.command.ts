#!/usr/bin/env ts-node
/* eslint-disable no-console */

import { spawn, ChildProcess } from 'child_process'


let childProcess: ChildProcess


//  ╦╗╔╦ ╔══╗ ═╦═ ╦╗ ╔   ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔═══ ╔═══   ╔══╗ ═╗╔═ ═╦═ ══╦══
//  ║╚╝║ ╠══╣  ║  ║╚╗║   ╠══╝ ╠═╦╝ ║  ║ ║    ╠═   ╚══╗ ╚══╗   ╠═    ╠╣   ║    ║
//  ╩  ╩ ╩  ╩ ═╩═ ╩ ╚╩   ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ═══╝ ═══╝   ╚══╝ ═╝╚═ ═╩═   ╩
process.on('SIGINT', handleMainProcessExit)
process.on('SIGTERM', handleMainProcessExit)

function handleMainProcessExit() {
  console.log('Shutting down process gracefully...')
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
      console.log('Restarting process...')
      startProcess(script, args)
    }
  })
}

const [tsNodePath, , ...args] = process.argv

startProcess(tsNodePath, [__dirname + '/dot.command.child.ts', ...args])
