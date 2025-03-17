

import { RouteFromDaoConfigForGenerateSdk } from '../../types/core.types'

import { getApiEndpointsPerRolesFromDao } from '../../databases/helpers/getApiEndpointsPerRolesFromDao'
import { objEntries, pushIfNotExist } from 'topkat-utils'
import { getMainConfig } from '../../helpers/getGreenDotConfigs'
import { getProjectDatabaseDaos } from '../../helpers/getProjectModelsAndDaos'



/** GENERATE ROUTES, DOC and SDK FOR FRONT */
export async function getDaoRouteDescriptionFromDaoConfigs() {

  const allDaoRoutes: string[] = []
  const daoRoutesConfig = {} as RouteFromDaoConfigForGenerateSdk

  const mainConfig = getMainConfig()
  const { allRoles, generateSdkConfig } = mainConfig
  const { sdkNameForRole } = generateSdkConfig

  const daos = await getProjectDatabaseDaos()

  for (const [dbId, daoForModels] of objEntries(daos)) {
    for (const [modelName, dao] of objEntries(daoForModels)) {

      const { fullMethodsPerRole } = getApiEndpointsPerRolesFromDao(dao.expose, allRoles)

      for (const [role, allMethods] of objEntries(fullMethodsPerRole)) {
        for (const fnName of allMethods) {

          const route = `/${dbId}/${modelName}/${fnName}`
          const platform = sdkNameForRole[role]
          allDaoRoutes[role] ??= []
          daoRoutesConfig[platform] ??= {}

          pushIfNotExist(allDaoRoutes, route)

          daoRoutesConfig[platform][route] = {
            dbType: dao.type,
            dbId,
            dbName: 'default',
            modelName,
            daoMethod: fnName,
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
