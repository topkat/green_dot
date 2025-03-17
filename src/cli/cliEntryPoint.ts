#!/usr/bin/env ts-node

import { spawn, ChildProcess } from 'child_process'
import { clearCli } from './helpers/cliIntro'


let childProcess: ChildProcess


//  ╦╗╔╦ ╔══╗ ═╦═ ╦╗ ╔   ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔═══ ╔═══   ╔══╗ ═╗╔═ ═╦═ ══╦══
//  ║╚╝║ ╠══╣  ║  ║╚╗║   ╠══╝ ╠═╦╝ ║  ║ ║    ╠═   ╚══╗ ╚══╗   ╠═    ╠╣   ║    ║
//  ╩  ╩ ╩  ╩ ═╩═ ╩ ╚╩   ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ═══╝ ═══╝   ╚══╝ ═╝╚═ ═╩═   ╩
process.on('SIGINT', handleMainProcessExit)
process.on('SIGTERM', handleMainProcessExit)

function handleMainProcessExit() {
  console.log(`POPOPO`)
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
    console.log(`CHILDEXIT`)
    if (code !== 0) {
      clearCli()
      startProcess(script, args)
    }
  })
  childProcess.on('close', code => {
    console.log(`CLOSE`)
  })
  childProcess.on('disconnect', code => {
    console.log(`DIS`)
  })
  childProcess.on('error', code => {
    console.log(`ERR`)
  })


}

const [tsNodePath, , ...args] = process.argv

startProcess(tsNodePath, [__dirname + '/dot.command.ts', ...args])
