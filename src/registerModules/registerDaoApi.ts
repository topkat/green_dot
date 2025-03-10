
import { Application } from 'express'
import { generateLoginMw } from '../security/login.middleware'
import defaultDaoConfigMongo from '../databases/mongo/defaultDaoConfigMongo'
import { error } from '../core.error'
import { daoValidators } from '../databases/mongo/types/mongoDaoTypes'
import { hookInterpreterExpose } from '../databases/0_hooks/hookInterpreterExpose'
import { logRouteInfos } from './apiMiddlewares/logRouteInfo.middleware'
import { serverConfig, clientAppConfig } from '../cache/green_dot.app.config.cache'

import { Definition, DaoGenericMethods } from '../types/core.types'
import { MongoDaoMethodsFull } from '../databases/mongo/types/mongoDbTypes'

import { isset } from 'topkat-utils'
import { rateLimiterMiddleware } from '../security/serviceRouteRateLimiter'
import { getApiEndpointsPerRolesFromDao } from '../databases/helpers/getApiEndpointsPerRolesFromDao'

export async function registerDaoApi(
    app: Application,
) {
    //----------------------------------------
    // REGISTER DAOS APIS
    //----------------------------------------
    app.post(
        `/:dbId/:modelName/:daoFunction`,
        generateLoginMw(),
        rateLimiterMiddleware(),
        logRouteInfos(req => `${req.params.modelName}/${req.params.daoFunction}`, 'dao'),
        async (req, res, next) => {
            if (typeof req.body === 'string' && req.body.startsWith('{')) req.body = JSON.parse(req.body)

            const dbConfigs = await serverConfig.dbConfigs()

            try {

                type ReqParams = { dbId: string, modelName: string, daoFunction: MongoDaoMethodsFull }

                const { modelName, daoFunction, dbId: databaseId } = req.params as ReqParams
                const { ctx } = req as typeof req & { ctx: Ctx }

                ctx.isFromGeneratedDbApi = true

                if (typeof databaseId === 'undefined') error.serverError(ctx, 'aCompanyMustBeProvidedInOrderToConnectWithDaoApi', { ctxUser: ctx.getUserMinimal(), dbIdUndefined: true })


                const errExtraInfos = { ...req.params, fn: `registerDaoApi` }
                const params: any[] = req?.body?.params || []

                const dbConfig = dbConfigs[databaseId]?.[databaseId]?.models?.[modelName]

                if (typeof dbConfig === 'undefined') error.modelDoNotExist(ctx, errExtraInfos)

                const daoConfig = dbConfig.daoConfig || defaultDaoConfigMongo
                const dao = dbConfig.dao

                const dbName = clientAppConfig.dbIdsToDbNames[databaseId]
                if (!dbName) error.serverError(ctx, 'clientAppConfig.dbIdsToDbNames should be instanciated with all db names')

                if (!isset(daoValidators[daoFunction as any])) error.functionDoNotExistInModel(ctx, { ...errExtraInfos, daoFunction })

                const { paramsValidator, method } = daoValidators[daoFunction as any] as { method: DaoGenericMethods, paramsValidator: Definition, pathParamNb?: number }

                //----------------------------------------
                // IS API EXPOSED
                //----------------------------------------
                const { authorizedApiEndpoint } = getApiEndpointsPerRolesFromDao(daoConfig.expose, serverConfig.allRoles)
                const isApiAuthorized = authorizedApiEndpoint.includes(daoFunction) || false
                if (!isApiAuthorized) error[404](ctx, { fn: 'registerDaoApi.daoConfig.isApiExposedGeneric' })

                //----------------------------------------
                // IS EXPOSED TO PERM
                //----------------------------------------
                if (daoConfig.expose) await hookInterpreterExpose(ctx, daoConfig.expose, databaseId, 'bangk', method, modelName)

                //----------------------------------------
                // VALIDATE FUNCTION PARAMS
                //----------------------------------------
                await paramsValidator.formatAndValidate(params, { user: ctx.getUserMinimal(), dbName, dbId: databaseId, errorExtraInfos: errExtraInfos, disableFormatting: true, modelName })

                //----------------------------------------
                // CALL DAO
                //----------------------------------------
                const resp = await dao[daoFunction as any].apply(null, [ctx, ...params])

                return res.json(resp)
            } catch (err) {
                next(err)
            }
        }
    )
}