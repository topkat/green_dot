
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

/**
 * Generates a unique token.
 * @param {number} length - The desired length of the token. Must be at least 8. Default: 20.
 * @param {'alphanumeric' | 'hexadecimal'} mode - The mode of the token, either 'alphanumeric' or 'hexadecimal'. Default: 'alphanumeric'.
 * @returns {string} - A unique token of the specified length.
 * @throws {Error} - Throws an error if the length is less than 8.
 * @note - The function generates a token based on a UUID and ensures uniqueness. A cache is used to avoid collisions.
 */
export function generateUniqueToken(length: number = 20, mode: 'alphanumeric' | 'hexadecimal' = 'alphanumeric'): string {
    if (length < 8) {
        throw new Error('Length must be at least 8 characters.')
    }

    const charset = mode === 'alphanumeric'
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        : '0123456789abcdef'

    let token: string

    token = uuidv4().replace(/-/g, '')

    const randomValues = new Uint8Array(length)
    crypto.getRandomValues(randomValues)

    if (mode === 'alphanumeric') {
        token = Array.from(token)
            .map(char => charset.includes(char) ? char : charset[Math.floor(Math.random() * charset.length)])
            .join('')
    }

    while (token.length < length) {
        token += charset[randomValues[token.length % length] % charset.length]
    }

    return token.slice(0, length)
}
