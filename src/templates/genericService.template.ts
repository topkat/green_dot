import { svc, db, _ } from 'green_dot'



export const loginWithEmail = svc({
  for: ['public', 'icoInvestor'],
  route: 'user/loginWithEmail',
  input: {

  },
  output: _.model('bangk', 'card'),
  rateLimiter: {
    default: '5/min',
    test: 'disable',
  },
  async main(ctx, {
    deviceId,
    deviceType,
    email,
    password,
  }) {
    const user = await db.user.getOne(ctx.GM, { email }, { triggerErrorIfNotSet: true })

    const userInBlacklist = await db.GD_serverBlackList.getOne(ctx.GM, { discriminator: getId(user) })

    if (userInBlacklist?.lockUntil) {
      if (new Date(userInBlacklist.lockUntil) > new Date()) {
        throw ctx.error.userLocked({ lockUntil: userInBlacklist.lockUntil })
      } else {
        await db.GD_serverBlackList.update(ctx.GM, getId(userInBlacklist), {
          lockUntil: null
        })
      }
    }

    return {
      ...await userLogin(ctx, 'icoInvestor', deviceId, deviceType, user, password)
    }
  },
})