import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import xmlparser from 'express-xml-bodyparser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { C, registerConfig, ENV, DescriptiveError } from 'topkat-utils'
import multer from 'multer'

import event from './event'
import { newSystemCtx } from './ctx'
import { GreenDotAppConfig } from './types/core.types'
import clientAppConfig from './cache/green_dot.app.config.cache'
import { registerModules } from './registerModules/registerModules'
import { getExpressErrHandlerMW } from './security/expressErrorHandler.middleware'
import { initTelegramBot } from './services/sendViaTelegram'
import { generateMainBackendFiles } from './generate/generateMainBackendFiles'
import { swaggerDocInit } from './documentation/swaggerDoc.init'
import { generateLoginMw } from './security/login.middleware'
import { rateLimiterMiddleware, rateLimiter as rateLimiterSvc } from './security/serviceRouteRateLimiter'
import { logRouteInfos } from './registerModules/apiMiddlewares/logRouteInfo.middleware'
import { dbIdsToDbNames } from './databases/dbIdsToDbNames'

const { DISPLAY_NO_BUILD_WARNING } = ENV()


const app = express()
dotenv.config()

const dbCache = {} as Awaited<ReturnType<typeof clientAppConfig.serverConfig.dbConfigs>>

export async function startServer(
    serverConfig: GreenDotAppConfig,
    allServices,
    allErrs,
    isMaster = true,
    isReloadModules = false, // allow to "soft restart" the server via api for example // TODO remove behavior
    loginHook: typeof clientAppConfig.serverConfig['onLogin']
) {
    try {
        Object.assign(clientAppConfig.serverConfig, serverConfig, { onLogin: loginHook }) // shall not remove reference of obj

        // INTRO
        if (isMaster) {
            if (isReloadModules) C.gradientize(`${'='.repeat(45)}\n|| SERVER SOFT RESTART${' '.repeat(45 - 24)}||\n${'='.repeat(45)}`)
            else C.gradientize(serverConfig.serverCliIntro) // CLI intro
            C.log(C.primary(`Env: ${serverConfig.env} | Schedules: ${serverConfig.enableSchedules ? '✓' : '✖️'} | Seeds: ${serverConfig.enableSeed ? '✓' : '✖️'}\n`))
            if (DISPLAY_NO_BUILD_WARNING) C.error(false, `✓ LOCAL BUILD NOT RAN`)
            else C.log(C.primary(`✓ BUILD ${serverConfig.appName}`))
        }

        // ABOUT DB CACHE
        // this is useful because initDB needs serverConfig when initializing but we don't want to initialize DB everytime we access it
        // so that's a DX friendly way to do it
        Object.assign(dbCache, await clientAppConfig.serverConfig.dbConfigs())
        clientAppConfig.serverConfig.dbConfigs = serverConfig.dbConfigs = async () => dbCache

        for (const [dbName, obj] of Object.entries(dbCache)) {
            for (const dbId in obj) {
                dbIdsToDbNames[dbId] = dbName
            }
        }

        clientAppConfig.errors = allErrs
        clientAppConfig.services = allServices

        registerConfig(serverConfig.dataValidationConfig)

        if (!isReloadModules && serverConfig.env !== 'build') {

            // initAws(serverConfig.awsConfig)
            initTelegramBot(serverConfig)

            app.disable('x-powered-by')

            app.use((_, res, next) => {
                res.set({
                    'Content-Security-Policy':
                        `default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests`,
                    'Cross-Origin-Opener-Policy': 'same-origin',
                    'Cross-Origin-Resource-Policy': 'same-origin',
                    // 'Origin-Agent-Cluster': '?1',
                    'Referrer-Policy': 'no-referrer',
                    'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
                    'X-Content-Type-Options': 'nosniff',
                    'X-DNS-Prefetch-Control': 'off',
                    'X-Download-Options': 'noopen',
                    'X-Frame-Options': 'SAMEORIGIN',
                    'X-Permitted-Cross-Domain-Policies': 'none',
                    'X-XSS-Protection': '0',
                })
                next()
            })

            app.use(cookieParser())
            app.use(cors({
                credentials: true,
                origin: function (origin, callback) {
                    const err = () => {
                        callback(new DescriptiveError('Not allowed by CORS: ' + origin, { origin, env: serverConfig.env, code: 500, doNotThrow: true }))
                    }
                    const success = () => callback(null, true)
                    if (!origin) success()
                    else if (typeof serverConfig?.corsOrigin === 'function') {
                        if (serverConfig?.corsOrigin(origin)) success()
                        else err()
                    } else if (!serverConfig?.corsOrigin || serverConfig?.corsOrigin.includes(origin)) success()
                    else err()
                },
            }))
            app.use((req, res, next) => {
                const initialBody = { ...req.body }

                if (req.headers['content-type']?.startsWith('multipart/form-data')) {
                    multer({ storage: multer.memoryStorage() }).any()(req, res, (err) => {
                        if (err) {
                            return res.status(400).send({ error: 'Error processing multipart/form-data' })
                        }
                        req.body = { ...initialBody, ...req.body }
                        next()
                    })
                } else {
                    next()
                }
            })
            app.use(bodyParser.urlencoded({ extended: false }))
            app.use(xmlparser())
            app.use(express.text())
            app.use(bodyParser.json({ limit: '1mb' }))
            app.set('trust proxy', true) // https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
        }

        await registerModules(app, isMaster)

        if (!isReloadModules) {

            await new Promise(resolve => app.listen(serverConfig.port, () => resolve(1)))

            if (isMaster) C.log(C.primary(`✓ SERVER STARTED: ${serverConfig.serverLiveUrl}`))

            // seed and server.start events shall be triggerred before exposing routes. This avoid
            // accidentally hitting a route without seeded content
            await event.emit('server.start', newSystemCtx(), isMaster, app)
        }

        //  ╔══╗ ╔═══ ╦   ╦ ╦╗ ╔ ╔══╗   ╔══╗ ╔══╗ ╦  ╦ ══╦══ ╔══╗ ╔═══
        //  ╠══╣ ╚══╗ ╚═╦═╝ ║╚╗║ ║      ╠═╦╝ ║  ║ ║  ║   ║   ╠═   ╚══╗
        //  ╩  ╩ ═══╝   ╩   ╩ ╚╩ ╚══╝   ╩ ╚  ╚══╝ ╚══╝   ╩   ╚══╝ ═══╝
        setTimeout(() => {
            if (serverConfig?.swaggerDocObject && serverConfig.env !== 'production' && serverConfig.env !== 'preprod') swaggerDocInit(app, serverConfig.swaggerDocObject, serverConfig.serverLiveUrl)

            // ALIVE ROUTE
            app.get('/alive*',
                generateLoginMw(),
                rateLimiterMiddleware(),
                (_, res) => res.json(true)
            )

            // TEST KILL PROCESS
            if (serverConfig.env === 'test') app.get(`/killProcess`, logRouteInfos('Killing Process', '💀'), () => process.exit(0))


            // 404 CATCH ALL ROUTE
            app.use(
                generateLoginMw(),
                middlewareForNotFoundRoutes
            )

            app.use(getExpressErrHandlerMW())

            generateMainBackendFiles() // should be async for perf

        }, 2000)

    } catch (err) {
        C.error(false, `Server couldn't start`)
        C.error(err)
    }
}




async function middlewareForNotFoundRoutes(req, res, next) {
    try {
        C.error(`Route not found: ${req.method} ${req.originalUrl}`)
        await rateLimiterSvc.recordAttemptAndThrowIfNeeded(req?.ctx, '404')
        return res.status(404).end()
    } catch (err) {
        next(err)
    }
}