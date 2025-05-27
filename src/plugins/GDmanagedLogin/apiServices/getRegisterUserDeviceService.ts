import { _ } from 'good-cop'
import { svc } from '../../../service'
import { checkOrChangeEmailOrPasswordRateLimiter } from '../constants'
import { updateEmailWithToken } from '../updatePasswordOrEmailWithToken'
import { PluginUserConfig } from '../main'
import { db } from '../../../db'
import { getId } from 'topkat-utils'


export function getUpdateEmailService(pluginConfig: PluginUserConfig) {
  return {
    registerUserDevice: svc({
      for: ['ALL', 'public'],
      input: _.model('bangk', 'device').required(),
      rateLimiter: '5/30s',
      async main(ctx, { ...deviceInfos }) {

        const _id = await db.device.upsert(ctx.GM, {
          ...deviceInfos,
          user: ctx._id,
        })

        // User may not be created actually
        const user = await db.user.getById(ctx.GM, ctx._id)

        if (user && !user.devices?.includes(_id)) {
          await db.user.update(ctx.GM, ctx._id, { $push: { devices: getId(_id) } })
        }
      },
    })
  }
}

