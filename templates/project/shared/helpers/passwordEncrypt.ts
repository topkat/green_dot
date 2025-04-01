
import bcrypt from 'bcrypt'

const config = {
  saltRounds: 11,
}

export async function encryptPassword(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync(config.saltRounds)
  return bcrypt.hashSync(password, salt)
}