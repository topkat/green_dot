
// /!\ TRY TO IMPORT THE LESS POSSIBLE IN THIS FILE /!\ \\
import { spawn, ChildProcess } from 'child_process'

let childProcess: ChildProcess

//  ╔═══ ══╦══ ╔══╗ ╔══╗ ══╦══   ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔═══ ╔═══
//  ╚══╗   ║   ╠══╣ ╠═╦╝   ║     ╠══╝ ╠═╦╝ ║  ║ ║    ╠═   ╚══╗ ╚══╗
//  ═══╝   ╩   ╩  ╩ ╩ ╚    ╩     ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ═══╝ ═══╝
/** Start a process with the first param of main process (Eg: ts-node if main process has been started with ts-node) */
export function startChildProcess(programPath, args: string[], onExit: (code: number) => any) {

  if (childProcess) childProcess.kill()
  console.log(`BEFORCP`, programPath, args)
  childProcess = spawn(programPath, args, { stdio: ['pipe', 'pipe', 'pipe'] })

  childProcess.stdout?.on('data', data => console.log(`[child:stdout] ${data.toString()}`))
  childProcess.stderr?.on('data', data => console.error(`[child:stderr] ${data.toString()}`))

  childProcess.on('exit', (code, signal) => console.log(`EXIT: ${code}, SIGNAL: ${signal}`))
  childProcess.on('error', err => console.error(`CHILD ERROR`, err))

  console.log(`AFTERCP`)
  childProcess.on('close', () => console.log(`CLOSE`))
  childProcess.on('disconnect', () => console.log(`DISCO`))
  childProcess.on('message', (m) => console.log(`DISCO`, JSON.stringify(m, null, 2)))
  childProcess.on('spawn', () => console.log(`SWN`))
  childProcess.on('exit', onExit)
}

//  ╦╗╔╦ ╔══╗ ═╦═ ╦╗ ╔   ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔═══ ╔═══   ╔══╗ ═╗╔═ ═╦═ ══╦══
//  ║╚╝║ ╠══╣  ║  ║╚╗║   ╠══╝ ╠═╦╝ ║  ║ ║    ╠═   ╚══╗ ╚══╗   ╠═    ╠╣   ║    ║
//  ╩  ╩ ╩  ╩ ═╩═ ╩ ╚╩   ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ═══╝ ═══╝   ╚══╝ ═╝╚═ ═╩═   ╩
process.on('SIGINT', handleMainProcessExit)
process.on('SIGTERM', handleMainProcessExit)

function handleMainProcessExit() {
  console.log(`EXITMAIN`)
  childProcess?.kill?.()
  process.exit()
}