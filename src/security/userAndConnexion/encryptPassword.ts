
import bcrypt from 'bcrypt'

export async function encryptPassword(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync(11)
  return bcrypt.hashSync(password, salt)
}