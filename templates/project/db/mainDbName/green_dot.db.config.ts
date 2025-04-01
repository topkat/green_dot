
import { GreenDotDbConfig } from 'green_dot'
import { ENV } from 'topkat-utils'

const {
  // START REPLICA SET WITH RUN-RS CLI TOOL
  MAIN_DB_URL = 'mongodb://127.0.0.1:27017/mainDb', // MUST not be localhost but 127.0.0.1
} = ENV()

//  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗
//  ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦
//  ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝
export default {
  type: 'mongo',
  name: 'mainDb',
  dbs: {
    connexionString: MAIN_DB_URL,
  }
} as const satisfies GreenDotDbConfig