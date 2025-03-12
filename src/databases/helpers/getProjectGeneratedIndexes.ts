

import { getProjectPaths } from "./getProjectPaths";
import { DbIds } from "../../cache/dbs/index.generated";
import { Definition } from "good-cop";
import { MongoDao, MongoDaoParsed } from "../mongo/types/mongoDbTypes";

type AllDbIds = DbIds[keyof DbIds]

export type DbIndexGenerated = {
  models: { [modelName in AllDbIds]: Definition }
  daos: Record<string, MongoDaoParsed<any> | MongoDao<any>>
}

const importCacheForDb = {} as { [dbName: string]: DbIndexGenerated }

export async function getGeneratedIndexForDatabase(dbName: string, resetCache = false) {
  if (!importCacheForDb[dbName] || resetCache === true) {
    const { dbConfigs } = await getProjectPaths()

    const path = dbConfigs[dbName].generatedIndexPath

    importCacheForDb[dbName] = await import(path) as DbIndexGenerated
  }

  return importCacheForDb[dbName]
}