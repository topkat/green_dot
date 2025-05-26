
import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'
import { error } from '../error'

import { ENV } from 'topkat-utils'

const {
  KEY_ENV,
  NODE_ENV,
} = ENV()

if (!KEY_ENV && NODE_ENV === 'production') throw error.serverError('env.KEY_ENV environment variable is not set')
const secretKey = KEY_ENV || 'MLGWeD3ZKlABbdZ2NumNLOo89RTsJeRO05N06Qs188'


/**
 * Encrypts a given string using AES encryption and a secret key from the environment.
 * A UUID is prepended to the data to ensure the encrypted token is unique.
 *
 * @param {string} token - The string to encrypt.
 * @returns {string} The encrypted token as a Base64 string.
 * @throws {Error} If the environment variable `SECRET_KEY` is not set.
 *
 * @example
 * const encryptedToken = encrypt("Hello, World!");
 * console.log(encryptedToken); // Example: U2FsdGVkX1...
 */
export function encryptToken(token: string) {
  const salt = uuidv4()
  const payload = `${salt}:${token}`
  return CryptoJS.AES.encrypt(payload.toString(), secretKey).toString() as string
}


/**
 * Decrypts a previously encrypted token and extracts the original data.
 * The function expects the encrypted token to contain a UUID and the original data.
 *
 * @param {string} token - The Base64-encoded encrypted token.
 * @returns {string} The original decrypted data string.
 * @throws {Error} If the environment variable `SECRET_KEY` is not set.
 * @throws {Error} If the decrypted token is invalid or improperly formatted.
 *
 * @example
 * const decryptedData = decrypt(encryptedToken);
 * console.log(decryptedData); // Output: "Hello, World!"
 */
export function decryptToken(ctx: Ctx, token: string): string {

  const bytes = CryptoJS.AES.decrypt(token.toString(), secretKey)

  const payload = bytes.toString(CryptoJS.enc.Utf8)

  const [, data] = payload.split(':')
  if (!data) throw ctx.error.wrongToken()

  return data as string
}

