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
import { registerModules } from './registerModules/registerModules'
import { getExpressErrHandlerMW } from './security/expressErrorHandler.middleware'
import { initTelegramBot } from './services/sendViaTelegram'
import { generateMainBackendFiles } from './generate/generateMainBackendFiles'
import { swaggerDocInit } from './documentation/swaggerDoc.init'
import { generateLoginMw } from './security/login.middleware'
import { rateLimiterMiddleware, rateLimiter as rateLimiterSvc } from './security/serviceRouteRateLimiter'
import { logRouteInfos } from './registerModules/apiMiddlewares/logRouteInfo.middleware'
import { getMainConfig, getActiveAppConfig } from './helpers/getGreenDotConfigs'

dotenv.config()

const { DISPLAY_NO_BUILD_WARNING } = ENV()


export async function startServer(
    appName: string,
    isMaster = true,
) {
    try {
        const mainConfig = await getMainConfig()
        const appConfig = await getActiveAppConfig()

        // INTRO
        if (isMaster) {
            // if (isReloadModules) C.gradientize(`${'='.repeat(45)}\n|| SERVER SOFT RESTART${' '.repeat(45 - 24)}||\n${'='.repeat(45)}`) else
            C.gradientize(appConfig.serverCliIntro) // CLI intro
            C.log(C.primary(`Env: ${mainConfig.env} | Schedules: ${appConfig.enableSchedules ? '✓' : '✖️'} | Seeds: ${appConfig.enableSeed ? '✓' : '✖️'}\n`))
            if (DISPLAY_NO_BUILD_WARNING) C.error(false, `✓ LOCAL BUILD NOT RAN`)
            else C.log(C.primary(`✓ BUILD ${appConfig.name}`))
        }

        registerConfig(appConfig.dataValidationConfig)

        const app = express()

        // initAws(serverConfig.awsConfig)
        initTelegramBot()

        app.disable('x-powered-by')

        app.use((_, res, next) => {
            res.set({
                'Content-Security-Policy': `default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests`,
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
                    callback(new DescriptiveError('Not allowed by CORS: ' + origin, { origin, env: mainConfig.env, code: 500, doNotThrow: true }))
                }
                const success = () => callback(null, true)
                if (!origin) success()
                else if (typeof appConfig?.corsOrigin === 'function') {
                    if (appConfig.corsOrigin(origin)) success()
                    else err()
                } else if (!appConfig?.corsOrigin || appConfig?.corsOrigin.includes(origin)) success()
                else err()
            },
        }))
        app.use((req, res, next) => {
            const initialBody = { ...req.body }

            if (req.headers['content-type']?.startsWith('multipart/form-data')) {
                multer({ storage: multer.memoryStorage() }).any()(req as any, res as any, (err) => { // TODO fix type ??
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


        await registerModules(app, isMaster)


        await new Promise(resolve => app.listen(appConfig.port, () => resolve(1)))

        if (isMaster) C.log(C.primary(`✓ SERVER STARTED: ${appConfig.serverLiveUrl}`))

        // seed and server.start events shall be triggerred before exposing routes. This avoid
        // accidentally hitting a route without seeded content
        await event.emit('server.start', newSystemCtx(), isMaster, app)

        // ALIVE ROUTE
        app.get('/alive', generateLoginMw(), rateLimiterMiddleware(), (_, res) => res.json(true))

        // ASYNC this is async to gain in server loading time
        setTimeout(async () => {

            // Expose a route for killing the server process (allow to emulate servers down)
            if (mainConfig.isTestEnv) app.get(`/killProcess`, logRouteInfos('Killing Process', '💀'), () => process.exit(0))

            // 404 catch all routes, make sure they are declared after everything (even custom user declared routes)
            app.use(
                generateLoginMw(),
                async (req, res, next) => {
                    try {
                        C.error(false, `Route not found: ${req.method} ${req.originalUrl}`)
                        await rateLimiterSvc.recordAttemptAndThrowIfNeeded((req as any)?.ctx, '404')
                        return res.status(404).end()
                    } catch (err) {
                        next(err)
                    }
                }
            )

            app.use(getExpressErrHandlerMW())

            if (!mainConfig.isProdEnv) {
                await generateMainBackendFiles()
                try {
                    const swaggerDoc = await import(`./cache/${appName}.swaggerDoc.generated.json`)
                    swaggerDocInit(app, swaggerDoc, appConfig.serverLiveUrl)
                } catch (err) {
                    C.error(false, `Swagger doc could not be generated and initiated`)
                }
            }

        }, 2000)

    } catch (err) {
        C.error(false, `Server couldn't start`)
        C.error(err)
    }
}



