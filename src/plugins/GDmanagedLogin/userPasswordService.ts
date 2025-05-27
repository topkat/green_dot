
import bcrypt from 'bcrypt'
import { db } from '../../db'
import { ModelTypes } from '../../cache/dbs/index.generated'

import { lockUserAndThrow } from '../../security/userAndConnexion/userLockService'

import { getId, timeout, random } from 'topkat-utils'
import { getPluginConfig } from '../pluginSystem'



const tooMuchPasswordMessages = 'tooMuchPasswordAttempts'


export async function comparePasswordAddAttemptAndLockIfNecessary(
  ctx: Ctx,
  password: string,
  hash: string,
  userOrId: ModelTypes['user'] | string,
  conf: {
    loginRetrialCountResetTimeMinutes?: number
    maxPasswordRetry?: number
    throwIfError?: boolean
  } = {}
): Promise<boolean> {

  const loginRetrialCountResetTimeMs = (conf.loginRetrialCountResetTimeMinutes || 30) * 60 * 1000

  await timeout(random(1, 80)) // anti timer attack

  const user = typeof userOrId === 'string' ? await db.user.getById(ctx, userOrId, { triggerErrorIfNotSet: true }) : userOrId

  const isValid = await bcrypt.compare(password, hash)

  if (isValid) {
    await db.user.update(ctx.GM, getId(user), {
      lastPasswordCompareTime: null,
      passwordRetrialNb: 0,
      ...(user.lockedReason?.includes(tooMuchPasswordMessages) ? {
        isLocked: false,
        lockUntil: null,
      } : {}),
    })
    return true
  } else {
    if ((new Date(user.lastPasswordCompareTime)).getTime() < Date.now() - loginRetrialCountResetTimeMs) {
      // THIS IS THE FIRST ATTEMPT IN A LONG TIME so we reset password attempts
      await db.user.update(ctx.GM, getId(user), {
        lastPasswordCompareTime: new Date(),
        passwordRetrialNb: 1,
      })
    } else {
      // MULTIPLE ATTEMPTS, increment attemps number and lock user is needed
      if (user.passwordRetrialNb >= (conf.maxPasswordRetry || 4)) {
        // TOO MUCH ATTEMPTS
        await lockUserAndThrow(ctx, getId(user), tooMuchPasswordMessages)
      } else {
        // ACCEPTABLE NB OF ATTEMPTS
        await db.user.update(ctx.GM, getId(user), {
          lastPasswordCompareTime: new Date(),
          $inc: { passwordRetrialNb: 1 }
        })
      }
    }

    if (typeof conf.throwIfError === 'undefined' || conf.throwIfError === true) throw ctx.error.wrongPassword({ passwordRetrialNb: user.passwordRetrialNb })

    return false
  }
}




export async function encryptPassword(password: string): Promise<string> {
  const { saltRoundsForPasswordEncryption } = getPluginConfig('GDmanagedLogin')
  const salt = bcrypt.genSaltSync(saltRoundsForPasswordEncryption || 11)
  return bcrypt.hashSync(password, salt)
}