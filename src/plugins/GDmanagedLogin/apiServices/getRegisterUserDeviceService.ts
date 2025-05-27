import { _ } from 'good-cop'
import { svc } from '../../../service'
import { db } from '../../../db'
import { getId } from 'topkat-utils'
import { getMainConfig } from '../../../helpers/getGreenDotConfigs'


export function getRegisterUserDeviceService() {

  const mainConfig = getMainConfig()

  return {
    registerUserDevice: svc({
      for: ['ALL', 'public'],
      input: _.model(mainConfig.defaultDatabaseName, 'GD_deviceModel').required(),
      rateLimiter: { default: '5/30s', test: '100/30s' },
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

