

import { DaoHookNamesMongo, MongoDao, MongoDaoParsed } from './mongo/types/mongoDbTypes'
import { parseForClause } from '../security/helpers/parseForClause'
import { registerDaoHooks } from './0_hooks/registerDaoHooks'
import { asArray, JSONstringyParse, objKeys } from 'topkat-utils'






export function parseDaos<
  DaoConfigsRaw extends Record<string, MongoDaoParsed<any> | MongoDao<any>>,
  DaoConfigsParsed extends Record<keyof DaoConfigsRaw, MongoDaoParsed<any>>
>(
  modelNames: string[],
  daoConfigsGeneratedRaw: DaoConfigsRaw,
  defaultDaoConfig?: MongoDaoParsed<any> | MongoDao<any>,
): DaoConfigsParsed {



  const daoConfigsParsed = daoConfigsGeneratedRaw as any as DaoConfigsParsed

  for (const modelName of objKeys(daoConfigsGeneratedRaw)) {
    // DEFAULT VALUES FOR EACH DAO
    (daoConfigsParsed as any)[modelName] ??= {}

    setDaoDefaultValues(daoConfigsParsed[modelName], defaultDaoConfig)
    mergeDaoWith(daoConfigsParsed[modelName], defaultDaoConfig)
    registerDaoHooks(modelName, daoConfigsParsed[modelName])
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

function mergeDaoWith(original: MongoDaoParsed<any>, toMerge: MongoDaoParsed<any> | MongoDao<any>) {

  const toMergeNew = JSONstringyParse(toMerge)

  for (const hookName in toMergeNew) {
    const hookInDaoConfForModel = original[hookName]

    // TODO replace with mongo Hook names when needed
    const authorizedToMerge: DaoHookNamesMongo[] = ['expose', 'mask']

    if (typeof hookInDaoConfForModel === 'undefined') original[hookName] = toMergeNew[hookName]
    else if (authorizedToMerge.includes(hookName as DaoHookNamesMongo)) original[hookName] = [...asArray(original[hookName]), ...asArray(toMergeNew[hookName], [])]

    for (const hook of original.expose) {
      if (hook.for && typeof hook.for !== 'function') hook.for = parseForClause(hook.for)
    }
  }
}