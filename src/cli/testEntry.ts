// #!/usr/bin/env ts-node
console.log('CHILD ENTRYPOINT LOADED')
setTimeout(() => {
  console.log('CHILD EXITING')
  process.exit(0)
}, 2000)