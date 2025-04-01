
import { random } from 'topkat-utils'

export const createRandomPhoneNumber = () => '6' + random(0, 99999999).toString().padStart(8, '0')