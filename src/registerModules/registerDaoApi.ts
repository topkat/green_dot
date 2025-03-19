
import { Application } from 'express'
import { generateLoginMw } from '../security/login.middleware'
import { daoValidators } from '../databases/mongo/types/mongoDaoTypes'
import { hookInterpreterExpose } from '../databases/0_hooks/hookInterpreterExpose'
import { logRouteInfos } from './apiMiddlewares/logRouteInfo.middleware'

import { Definition, DaoGenericMethods } from '../types/core.types'
import { MongoDaoMethodsFull } from '../databases/mongo/types/mongoDbTypes'

import { isset } from 'topkat-utils'
import { rateLimiterMiddleware } from '../security/serviceRouteRateLimiter'
import { getApiEndpointsPerRolesFromDao } from '../databases/helpers/getApiEndpointsPerRolesFromDao'
import { getProjectDatabaseModels } from '../helpers/getProjectModelsAndDaos'
import { getProjectDatabaseDaos } from '../helpers/getProjectModelsAndDaos'
import { getMainConfig } from '../helpers/getGreenDotConfigs'
import { dbIdsToDbNames } from '../databases/dbIdsToDbNames'

import { dbs } from '../db'

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

            const { allRoles } = getMainConfig()
            const models = await getProjectDatabaseModels()
            const daos = await getProjectDatabaseDaos()

            try {

                type ReqParams = { dbId: string, modelName: string, daoFunction: MongoDaoMethodsFull }

                const { modelName, daoFunction, dbId: dbId } = req.params as ReqParams
                const { ctx } = req as typeof req & { ctx: Ctx }

                ctx.isFromGeneratedDbApi = true

                if (typeof dbId === 'undefined') throw ctx.error.serverError('aCompanyMustBeProvidedInOrderToConnectWithDaoApi', { ctxUser: ctx.getUserMinimal(), dbIdUndefined: true })


                const errExtraInfos = { ...req.params, fn: `registerDaoApi` }
                const params: any[] = req?.body?.params || []

                const model = models[dbId]?.[modelName]
                const dao = daos[dbId]?.[modelName]

                if (typeof model === 'undefined') throw ctx.error.modelDoNotExist(errExtraInfos)

                const dbName = dbIdsToDbNames[dbId]
                if (!dbName) throw ctx.error.serverError('dbIdsToDbNames should be instanciated with all db names')

                if (!isset(daoValidators[daoFunction as any])) throw ctx.error.functionDoNotExistInModel({ ...errExtraInfos, daoFunction })

                const { paramsValidator, method } = daoValidators[daoFunction as any] as { method: DaoGenericMethods, paramsValidator: Definition, pathParamNb?: number }

                //----------------------------------------
                // IS API EXPOSED
                //----------------------------------------
                const { authorizedApiEndpoint } = getApiEndpointsPerRolesFromDao(dao.expose, allRoles)
                const isApiAuthorized = authorizedApiEndpoint.includes(daoFunction) || false
                if (!isApiAuthorized) ctx.throw[404]({ fn: 'registerDaoApi.daoConfig.isApiExposedGeneric' })

                //----------------------------------------
                // IS EXPOSED TO PERM
                //----------------------------------------
                if (dao.expose) await hookInterpreterExpose(ctx, dao.expose, dbId, 'bangk', method, modelName)

                //----------------------------------------
                // VALIDATE FUNCTION PARAMS
                //----------------------------------------
                await paramsValidator.formatAndValidate(params, { user: ctx.getUserMinimal(), dbName, dbId: dbId, errorExtraInfos: errExtraInfos, disableFormatting: true, modelName })

                //----------------------------------------
                // CALL DAO
                //----------------------------------------
                const resp = await dbs[dbId][modelName][daoFunction].apply(null, [ctx, ...params])

                return res.json(resp)
            } catch (err) {
                next(err)
            }
        }
    )
}