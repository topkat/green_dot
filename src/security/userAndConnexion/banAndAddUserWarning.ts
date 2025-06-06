import { C, getId } from 'topkat-utils'
import { db } from '../../db.js'
import { getActiveAppConfig, getMainConfig } from '../../helpers/getGreenDotConfigs.js'
import { GreenDotConfigRateLimiterInfos } from '../../types/mainConfig.types.js'
import { GD_serverBlacklistModel } from './GD_serverBlackList.model.js'

type GD_serverBlackList = typeof GD_serverBlacklistModel.tsType

let blackListCache = [] as GD_serverBlackList[]
let blacklistLastCacheCheck = 0

//  ╔══╗ ╦  ╦ ╔══╗ ╔══╗ ╦ ╔  ╔═══
//  ║    ╠══╣ ╠═   ║    ╠═╩╗ ╚══╗
//  ╚══╝ ╩  ╩ ╚══╝ ╚══╝ ╩  ╚ ═══╝
export async function checkUserBlacklistCache(ctx, { discriminator }) {

  const { customWarningAndBanUserFunctions } = getMainConfig()
  const { enableUserBan, enableUserWarnings, blackListCheckInterval } = await getActiveAppConfig()

  if ((enableUserBan || enableUserWarnings) && !customWarningAndBanUserFunctions) {

    // CLEAN DB CACHE AND REFRESH CACHE
    const now = Date.now()

    if (blacklistLastCacheCheck < now - blackListCheckInterval) {
      const allBlackList = await db.GD_serverBlackList.getAll(ctx.GM) as any as GD_serverBlackList[]
      const blackListed = [] as GD_serverBlackList[]
      for (const b of allBlackList) {
        if (b.lockUntil) {
          if (new Date(b.lockUntil) <= new Date()) {
            // REMOVE LOCKUNTIL FIELD
            await db.GD_serverBlackList.update(ctx.GM, getId(b), { lockUntil: null })
          } else {
            blackListed.push(b)
          }
        }
      }

      blackListCache = allBlackList
      blacklistLastCacheCheck = now
    }

    // FIND IF USER IS BLOCKED IN THE CACHE
    const item = blackListCache.find(b => b.discriminator === discriminator)

    if (item && item.lockUntil && new Date(item.lockUntil) > new Date()) {
      // USER IS LOCKED
      throw ctx.error.accessDenied({
        nbBans: item.nbBan,
        lockedUntil: item.lockUntil,
        additionalMessage: 'Your account has been suspended due to a violation of our terms of service. Please contact support for further assistance if you believe this is a mistake.'
      })
    }
  }
}

//  ╦  ╦ ╔══╗ ╔══╗ ╦╗ ╔
//  ║╔╗║ ╠══╣ ╠═╦╝ ║╚╗║
//  ╩╝╚╩ ╩  ╩ ╩ ╚  ╩ ╚╩
export async function addUserWarning(ctx, { discriminator, route }: GreenDotConfigRateLimiterInfos) {

  const { customWarningAndBanUserFunctions } = getMainConfig()
  const { enableUserWarnings } = await getActiveAppConfig()

  if (enableUserWarnings) {

    if (customWarningAndBanUserFunctions) {
      // CUSTOM
      return await customWarningAndBanUserFunctions.addUserWarning(ctx, { discriminator, route })
    } else {
      let userInBlacklist = blackListCache.find(b => b.discriminator === discriminator)
      if (!userInBlacklist) {
        // CREATE DB ITEM
        userInBlacklist = await db.GD_serverBlackList.create(ctx.GM, { discriminator }, { returnDoc: true }) as any as GD_serverBlackList
        blackListCache.push(userInBlacklist)
      } else {
        // UPDATE NB WARNINGS
        userInBlacklist.nbWarning++
        await db.GD_serverBlackList.update(ctx.GM, getId(userInBlacklist), { $inc: { nbWarning: 1 } })
      }

      return {
        nbWarnings: userInBlacklist.nbWarning,
        nbWarningLeftBeforeBan: 3,
      }
    }
  } else {
    C.warning(false, 'User has had a warning but warning has been disabled')
  }
}

//  ╔═╗  ╔══╗ ╦╗ ╔
//  ╠═╩╗ ╠══╣ ║╚╗║
//  ╚══╝ ╩  ╩ ╩ ╚╩
export async function banUser(ctx, { discriminator, route }: GreenDotConfigRateLimiterInfos) {

  const { customWarningAndBanUserFunctions } = getMainConfig()
  const { enableUserBan, blackListBanMinutes } = await getActiveAppConfig()

  if (enableUserBan) {

    if (customWarningAndBanUserFunctions) {
      // CUSTOM
      await customWarningAndBanUserFunctions.banUser(ctx, { discriminator, route })
    } else {

      let blackListItem = blackListCache.find(b => b.discriminator === discriminator)
      if (!blackListItem) {
        // CREATE ITEM
        blackListItem = await db.GD_serverBlackList.create(ctx.GM, { discriminator }, { returnDoc: true }) as any as GD_serverBlackList
        blackListCache.push(blackListItem)
      }
      const banDurationMin = blackListBanMinutes[blackListItem.nbBan] || blackListBanMinutes.at(-1)
      const fields = { lockUntil: new Date(Date.now() + banDurationMin * 60 * 1000), nbWarning: 0 } satisfies Partial<GD_serverBlackList>
      Object.assign(blackListItem, fields)
      blackListItem.nbBan++
      await db.GD_serverBlackList.update(ctx.GM, getId(blackListItem), { $inc: { nbBan: 1 }, ...fields })
    }

  } else {
    C.warning(false, 'User has been banned but ban has been disabled')
  }
}