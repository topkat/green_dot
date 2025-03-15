

import { DaoHookNamesMongo, MongoDao, MongoDaoParsed } from './mongo/types/mongoDbTypes'
import { parseForClause } from '../security/helpers/parseForClause'
import { registerDaoHooks } from './0_hooks/registerDaoHooks'
import { asArray, JSONstringyParse } from 'topkat-utils'




export async function parseDaos<
  DaoConfigsRaw extends Record<string, MongoDaoParsed<any> | MongoDao<any>>,
  DaoConfigsParsed extends Record<keyof DaoConfigsRaw, MongoDaoParsed<any>>
>(
  modelNames: string[], // we provide modelNames in case some models doesn't have a dao
  daoConfigsGeneratedRaw: DaoConfigsRaw,
  defaultDaoConfig?: MongoDaoParsed<any> | MongoDao<any>,
): Promise<DaoConfigsParsed> {



  const daoConfigsParsed = daoConfigsGeneratedRaw as any as DaoConfigsParsed

  for (const modelName of modelNames) {
    // DEFAULT VALUES FOR EACH DAO
    (daoConfigsParsed as any)[modelName] ??= {}

    await setDaoDefaultValues(daoConfigsParsed[modelName], defaultDaoConfig)
    await mergeDaoWith(daoConfigsParsed[modelName], defaultDaoConfig)
    await registerDaoHooks(modelName, daoConfigsParsed[modelName])
  }

  return daoConfigsParsed
}



//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝


function setDaoDefaultValues(
  dao: Partial<MongoDao<any> | MongoDaoParsed<any>>,
  defaultConfig: Partial<MongoDao<any> | MongoDaoParsed<any>> = {},
) {
  dao.expose ??= defaultConfig.expose || []
  dao.populate ??= []
}

async function mergeDaoWith(original: MongoDaoParsed<any>, toMerge: MongoDaoParsed<any> | MongoDao<any>) {

  const toMergeNew = JSONstringyParse(toMerge)

  for (const hookName in toMergeNew) {
    const hookInDaoConfForModel = original[hookName]

    // TODO replace with mongo Hook names when needed
    const authorizedToMerge: DaoHookNamesMongo[] = ['expose', 'mask']

    if (typeof hookInDaoConfForModel === 'undefined') original[hookName] = toMergeNew[hookName]
    else if (authorizedToMerge.includes(hookName as DaoHookNamesMongo)) original[hookName] = [...asArray(original[hookName]), ...asArray(toMergeNew[hookName], [])]

    for (const hook of original.expose) {
      if (hook.for && typeof hook.for !== 'function') hook.for = await parseForClause(hook.for)
    }
  }
}