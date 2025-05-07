
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
  childProcess = spawn(programPath, args, {
    stdio: 'inherit', // Inherit main process I/O
  })
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