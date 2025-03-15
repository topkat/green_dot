import { C, getId } from 'topkat-utils'
import { throwError } from '../../core.error'
import { dbs } from '../../db'
import { GD_serverBlacklistModel } from './GD_serverBlackList.model'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'


type ServerBlacklist = typeof GD_serverBlacklistModel.tsType

let blackListCache = [] as ServerBlacklist[]
let blacklistLastCacheCheck = 0

//  ╔══╗ ╦  ╦ ╔══╗ ╔══╗ ╦ ╔  ╔═══
//  ║    ╠══╣ ╠═   ║    ╠═╩╗ ╚══╗
//  ╚══╝ ╩  ╩ ╚══╝ ╚══╝ ╩  ╚ ═══╝
export async function beforeApiRequest(ctx, { discriminator }) {

  const { enableUserBan, enableUserWarnings, blackListCheckInterval, defaultDatabaseName } = await getMainConfig()

  if (enableUserBan || enableUserWarnings) {

    // CLEAN DB CACHE AND REFRESH CACHE
    const now = Date.now()
    if (blacklistLastCacheCheck < now - blackListCheckInterval) {
      const allBlackList = await dbs[defaultDatabaseName].GD_serverBlacklistModel.getAll(ctx.GM)
      const blackListed = [] as ServerBlacklist[]
      for (const b of allBlackList) {
        if (b.lockUntil) {
          if (new Date(b.lockUntil) <= new Date()) {
            // REMOVE LOCKUNTIL FIELD
            await dbs.bangk.GD_serverBlacklistModel.update(ctx.GM, getId(b), { lockUntil: null })
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
      throwError.accessDenied(ctx, {
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
export async function addUserWarning(ctx, { discriminator }) {

  const { enableUserWarnings, defaultDatabaseName, customWarningAndBanUserFunctions } = await getMainConfig()

  if (enableUserWarnings) {

    if (customWarningAndBanUserFunctions) {
      // CUSTOM
      return await customWarningAndBanUserFunctions.addUserWarning(ctx, { discriminator })
    } else {
      let userInBlacklist = blackListCache.find(b => b.discriminator === discriminator)
      if (!userInBlacklist) {
        // CREATE DB ITEM
        userInBlacklist = await dbs[defaultDatabaseName].GD_serverBlacklistModel.create(ctx.GM, { discriminator }, { returnDoc: true })
        blackListCache.push(userInBlacklist)
      } else {
        // UPDATE NB WARNINGS
        userInBlacklist.nbWarning++
        await dbs[defaultDatabaseName].bangk.GD_serverBlacklistModel.update(ctx.GM, getId(userInBlacklist), { $inc: { nbWarning: 1 } })
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
export async function banUser(ctx, { discriminator }) {

  const { enableUserBan, defaultDatabaseName, blackListBanMinutes, customWarningAndBanUserFunctions } = await getMainConfig()

  if (enableUserBan) {

    if (customWarningAndBanUserFunctions) {
      // CUSTOM
      await customWarningAndBanUserFunctions.banUser(ctx, { discriminator })
    } else {

      let blackListItem = blackListCache.find(b => b.discriminator === discriminator)
      if (!blackListItem) {
        // CREATE ITEM
        blackListItem = await dbs[defaultDatabaseName].bangk.GD_serverBlacklistModel.create(ctx.GM, { discriminator }, { returnDoc: true })
        blackListCache.push(blackListItem)
      }
      const banDurationMin = blackListBanMinutes[blackListItem.nbBan] || blackListBanMinutes.at(-1)
      const fields = { lockUntil: new Date(Date.now() + banDurationMin * 60 * 1000), nbWarning: 0 } satisfies Partial<ServerBlacklist>
      Object.assign(blackListItem, fields)
      blackListItem.nbBan++
      await dbs[defaultDatabaseName].bangk.GD_serverBlacklistModel.update(ctx.GM, getId(blackListItem), { $inc: { nbBan: 1 }, ...fields })
    }

  } else {
    C.warning(false, 'User has been banned but ban has been disabled')
  }
}