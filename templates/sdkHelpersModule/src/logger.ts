/* eslint-disable no-console */


import { removeCircularJSONstringify } from 'topkat-utils'



export const log = {
  /** You can log any value here, it will be SAFELY stringified objects; arrays... */
  error(...msgs: any[]) {
    logg('error', ...msgs)
  },
  /** You can log any value here, it will be SAFELY stringified objects; arrays... */
  info(...msgs: any[]) {
    logg('log', ...msgs)
  },
  /** You can log any value here, it will be SAFELY stringified objects; arrays... */
  warning(...msgs: any[]) {
    logg('warn', ...msgs)
  }
}



function logg(level: 'warn' | 'error' | 'log', ...msgs) {
  return console[level](...msgs.map(m => {
    if (typeof m === 'string') return m
    else {
      try {
        let msg = ''
        if (m?.errorDescription) {
          m.hasBeenLogged = true
          msg = m.logs.join('\n')
        } else {
          if (m?.message) msg += m.message + '\n'
          if (m?.stack) msg += m.stack + '\n'
          msg += removeCircularJSONstringify(m, 2)
        }
        return msg
      } catch (err) {
        console.error('errorWhileStringifyingErrorMessage')
        console.error(err)
        console.error('Original err msg:')
        console.error(m)
        return m.toString()
      }
    }
  }))
}