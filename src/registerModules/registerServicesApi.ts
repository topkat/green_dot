

import { throwError } from '../core.error'
import { generateLoginMw } from '../security/login.middleware'
import { sortUrlsByDeepnessInArrayOrObject } from './utils/sortUrlByDeepness'
import { logRouteInfos } from './apiMiddlewares/logRouteInfo.middleware'
import { rateLimiterMiddleware } from '../security/serviceRouteRateLimiter'
import { ApiOutputTypes, ServiceRegistered } from '../types/core.types'
import { Application } from 'express'
import { env } from '../helpers/getEnv'

import { isset, C } from 'topkat-utils'

export async function registerServiceApi(
    app: Application,
    serviceRoutes: { [route: string]: ServiceRegistered },
) {

    //----------------------------------------
    // REGISTER SERVICES APIS
    //----------------------------------------
    const routesArrSorted = sortUrlsByDeepnessInArrayOrObject(Object.entries(serviceRoutes), 0) as [string, typeof serviceRoutes[string]][]
    const allRoutes: string[] = [] // for doc

    for (const [routeRaw, { main, method: methodRaw = 'POST', forEnv, rateLimiter, aliasRoute, ipWhitelist }] of routesArrSorted) {

        for (const route of [routeRaw, aliasRoute].filter(e => e)) {

            const method = methodRaw.toLowerCase()
            const routeStr = '/' + route
            allRoutes.push(routeStr)
            if (!isset(app[method])) throwError.serverError('API method do not exist', { methodRaw })

            if (forEnv) {
                // trigger 404 if wrong env
                const isWrongEnvStr = typeof forEnv === 'string' && env.env !== forEnv
                const isWrongEnvArr = Array.isArray(forEnv) && !forEnv.includes(env.env)
                if (isWrongEnvStr || isWrongEnvArr) {
                    app[method](
                        routeStr,
                        (_, res) => {
                            // vv this can help to catch penetration trial vv
                            if (env.isProd) throwError.serverError('tryingToAccessDevRouteInProduction', { route, doNotThrow: true, actualEnv: env.env, exectedEnv: forEnv, notifyAdmins: true })
                            res.status(404).end()
                        }
                    )
                    continue
                }
            }

            app[method](
                routeStr,
                generateLoginMw(),
                logRouteInfos(route, 'svc'),
                rateLimiterMiddleware(ipWhitelist, rateLimiter),
                async (req, res, next) => {
                    try {
                        const ctx: Ctx = req.ctx

                        if (ipWhitelist && !ipWhitelist.includes(ctx.api.ipAdress.replace('::ffff:', ''))) {
                            return res.status(404).end()
                        }

                        if (typeof req.body === 'string' && req.body.startsWith('{')) {
                            try { req.body = JSON.parse(req.body) } catch (err) { C.error(err) }
                        }

                        const params: any[] = req.body.params || [req.body]


                        const output = await (main as any)(ctx, ...params)

                        //  ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔═══ ╔═══   ╔══╗ ╦  ╦ ══╦══ ╔══╗ ╦  ╦ ══╦══
                        //  ╠══╝ ╠═╦╝ ║  ║ ║    ╠═   ╚══╗ ╚══╗   ║  ║ ║  ║   ║   ╠══╝ ║  ║   ║
                        //  ╩    ╩ ╚  ╚══╝ ╚══╝ ╚══╝ ═══╝ ═══╝   ╚══╝ ╚══╝   ╩   ╩    ╚══╝   ╩
                        let { outputType = 'json' } = ctx.api

                        const sendBufferObject = (res, bufferObject) => {
                            res.set('Content-Type', bufferObject.mimeType)
                            res.send(bufferObject.buffer)
                        }

                        const outputFn = {
                            // pdf: () => pdfService.streamToRes(ctx, res, output, next),
                            xml: () => {
                                res.set('Content-Type', 'text/xml')
                                res.type('text/xml')
                                res.send(output)
                            },
                            file: () => res.sendFile(output),
                            download: () => res.download(output),
                            raw: () => res.send(output),
                            docx: () => res.send(Buffer.from(output)), // new Buffer(output, 'binary')
                            bufferObject: () => sendBufferObject(res, output),
                            excel: () => {
                                if (!isset(output.title, output.wb)) ctx.throw.serverError('excel output should be provided in the form of { wb, title }')
                                return output.wb.write(`${output.title.replace(' ', '-')}.xlsx`, res)
                            },
                            json: () => res.json(output),
                        } satisfies Record<ApiOutputTypes, Function>

                        if (typeof outputType === 'function') outputType = outputType(req, ctx)

                        if (typeof outputType === 'string' && isset(outputFn[outputType])) return outputFn[outputType]()
                        else return res.json(output)

                    } catch (err) {
                        next(err)
                    }
                }
            )
        }
    }


    return allRoutes
}

