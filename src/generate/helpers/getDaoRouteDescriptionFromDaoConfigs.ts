

import { RouteFromDaoConfigForGenerateSdk } from '../../types/core.types'

import defaultDaoConfigMongo from '../../databases/mongo/defaultDaoConfigMongo'

import { getApiEndpointsPerRolesFromDao } from '../../databases/helpers/getApiEndpointsPerRolesFromDao'
import { objEntries, pushIfNotExist } from 'topkat-utils'
import { serverConfig } from '../../cache/green_dot.app.config.cache'



/** GENERATE ROUTES, DOC and SDK FOR FRONT */
export async function getDaoRouteDescriptionFromDaoConfigs() {

  const allDaoRoutes: string[] = []
  const daoRoutesConfig = {} as RouteFromDaoConfigForGenerateSdk
  const { platformForPermission } = serverConfig

  const dbConfForDb = await serverConfig.dbConfigs()

  for (const [dbId, dbConfForCollections] of objEntries(dbConfForDb)) {
    for (const dbConfForCollection of Object.values(dbConfForCollections)) {
      for (const [modelName, daoConfig] of objEntries(dbConfForCollection.daoConfigsParsed)) {

        const defaultConf = defaultDaoConfigMongo
        const daoConfigSure = daoConfig || defaultConf

        const { fullMethodsPerRole } = getApiEndpointsPerRolesFromDao(daoConfigSure.expose, serverConfig.allRoles)

        for (const [role, allMethods] of objEntries(fullMethodsPerRole)) {
          for (const fnName of allMethods) {

            const route = `/${dbId}/${modelName}/${fnName}`
            const platform = platformForPermission[role]
            allDaoRoutes[role] ??= []
            daoRoutesConfig[platform] ??= {}

            pushIfNotExist(allDaoRoutes, route)

            daoRoutesConfig[platform][route] = {
              dbType: daoConfig.type,
              dbId,
              dbName: 'default',
              modelName,
              daoMethod: fnName,
            }
          }
        }
      }
    }
  }
  return {
    allDaoRoutes,
    daoRoutesConfig,
  }
}
