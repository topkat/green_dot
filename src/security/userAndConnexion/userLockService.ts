


import { userConfig } from '../user.config'
import { UserLockReasons } from '../../../shared/frontBackConstants'
import { db } from '../../db'
import { ModelTypes } from '../../cache/dbs/index.generated'

import { getId, addMinutes } from 'topkat-utils'


export async function ensureUserIsNotLocked(ctx: Ctx, userOrId: ModelTypes['user'] | string) {

  const user = typeof userOrId === 'string' ? await db.user.getById(ctx.GM, userOrId, { triggerErrorIfNotSet: true }) : userOrId

  if (user.isLocked) {
    if (user.lockUntil && (new Date(user.lockUntil)).getTime() < Date.now()) {
      // UNLOCK
      user.isLocked = false
      delete user.lockUntil
      await db.user.update(ctx.GM, getId(user), {
        isLocked: false,
        lockUntil: null,
      })
    } else {
      // IS LOCKED ERROR
      throw ctx.error.userLocked({ lockUntil: user.lockUntil, lockedReason: user.lockedReason, userId: getId(user) })
    }
  }
}


export async function lockUserAndThrow(ctx: Ctx, userId: string, reason: UserLockReasons, conf: {
  errExtraInfos?: Record<string, any>,
  lockDurationMinutes?: number
} = {}) {
  const lockUntil = addMinutes(new Date(), conf.lockDurationMinutes || 15, 'date')
  await db.user.update(ctx.GM, userId, {
    isLocked: true,
    lockedReason: reason,
    lockUntil,
    refreshTokens: [],
  })

  throw ctx.error.userLocked({
    lockedReason: reason,
    lockUntil: addMinutes(new Date(), conf.lockDurationMinutes || 15),
    userId,
    ...(conf.errExtraInfos || {})
  })
}