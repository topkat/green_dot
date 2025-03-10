import { getId } from "topkat-utils"



let blackListCache = [] as ServerBlacklist[]
let blacklistLastCacheCheck = 0
// TODO TAKE THAT FROM CONFIG
const blackListCacheInterval = env === 'test' ? 1000 : 3 * 60 * 1000
const blackListBanMinutes = [15, 120, 12 * 60]

export async function getUserFromCtx(ctx) {
  return await getDb().bangk.user.getById(ctx.GM, ctx._id, { triggerErrorIfNotSet: true })
}
//  ╔══╗ ╔══╗ ══╦══ ╔══╗   ╦    ═╦═ ╦╗╔╦ ═╦═ ══╦══ ╔══╗ ╔══╗
//  ╠═╦╝ ╠══╣   ║   ╠═     ║     ║  ║╚╝║  ║    ║   ╠═   ╠═╦╝
//  ╩ ╚  ╩  ╩   ╩   ╚══╝   ╚══╝ ═╩═ ╩  ╩ ═╩═   ╩   ╚══╝ ╩ ╚
export async function beforeApiRequest(ctx, { discriminator }) {
  const now = Date.now()
  if (blacklistLastCacheCheck < now - blackListCacheInterval) {
    const allBlackList = await getDb().bangk.serverBlacklist.getAll(ctx.GM)
    const blackListed = [] as ServerBlacklist[]
    for (const b of allBlackList) {
      if (b.lockUntil) {
        if (new Date(b.lockUntil) <= new Date()) {
          // REMOVE LOCKUNTIL FIELD
          await getDb().bangk.serverBlacklist.update(ctx.GM, getId(b), { lockUntil: null })
        } else {
          blackListed.push(b)
        }
      }
    }

    blackListCache = allBlackList
    blacklistLastCacheCheck = now
  }

  const item = blackListCache
    .filter(b => b.lockUntil && new Date(b.lockUntil) > new Date())
    .find(b => b.discriminator === discriminator)

  if (item) {
    allCoreErrors.accessDenied(ctx, {
      nbBans: item.nbBan,
      lockedUntil: item.lockUntil,
      additionalMessage: 'Your account has been suspended due to a violation of our terms of service. Please contact support for further assistance if you believe this is a mistake.'
    })
  }
}


export async function addUserWarning(ctx, { discriminator }) {
  let blackListItem = blackListCache.find(b => b.discriminator === discriminator)
  if (!blackListItem) {
    // CREATE ITEM
    blackListItem = await getDb().bangk.serverBlacklist.create(ctx.GM, { discriminator }, { returnDoc: true })
    blackListCache.push(blackListItem)
  } else if (!isPenTestEnv) {
    // UPDATE NB WARNINGS
    blackListItem.nbWarning++
    await getDb().bangk.serverBlacklist.update(ctx.GM, getId(blackListItem), { $inc: { nbWarning: 1 } })
  }

  return {
    nbWarnings: isPenTestEnv ? 1 : blackListItem.nbWarning,
    nbWarningLeftBeforeBan: 3,
    resetNbAttempts: isPenTestEnv,
    IMPORTANT_MESSAGE: isPenTestEnv ? `FOR PENTESTERS: You are receiving a warning. Typically, after three warnings, you would be removed from the server; however, we have disabled this feature and reset the counter so you can continue working on identifying vulnerabilities` : undefined
  }
},
    async banUser(ctx, { discriminator }) {

  if (isPenTestEnv || env === 'development') return

  let blackListItem = blackListCache.find(b => b.discriminator === discriminator)
  if (!blackListItem) {
    // CREATE ITEM
    blackListItem = await getDb().bangk.serverBlacklist.create(ctx.GM, { discriminator }, { returnDoc: true })
    blackListCache.push(blackListItem)
  }
  const banDurationMin = blackListBanMinutes[blackListItem.nbBan] || blackListBanMinutes.at(-1)
  const fields = { lockUntil: new Date(Date.now() + banDurationMin * 60 * 1000), nbWarning: 0 } satisfies Partial<ServerBlacklist>
  Object.assign(blackListItem, fields)
  blackListItem.nbBan++
  await getDb().bangk.serverBlacklist.update(ctx.GM, getId(blackListItem), { $inc: { nbBan: 1 }, ...fields })
},