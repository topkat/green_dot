

import express, { Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import xmlparser from 'express-xml-bodyparser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { C, registerConfig, ENV, DescriptiveError } from 'topkat-utils'
import multer from 'multer'

import event from './event'
import { initTelegramBot } from './services/sendViaTelegram'
import { generateLoginMw } from './security/login.middleware'
import { rateLimiterMiddleware } from './security/serviceRouteRateLimiter'
import { logRouteInfos } from './registerModules/apiMiddlewares/logRouteInfo.middleware'
import { getMainConfig, getActiveAppConfig, initGreenDotConfigs } from './helpers/getGreenDotConfigs'
import { registerDaoApi } from './registerModules/registerDaoApi'
import { registerServiceApi } from './registerModules/registerServicesApi'
import { registerServices } from './registerModules/registerServices'
import { initProjectAndDaosCache } from './helpers/getProjectModelsAndDaos'
import { env } from './helpers/getEnv'
import { startServerAsyncTasks } from './startServerAsyncTasks'
import { newSystemCtx } from './ctx'
import { initDbs } from './db'

dotenv.config()

const { DISPLAY_NO_BUILD_WARNING } = ENV()

let server: ReturnType<ReturnType<typeof express>['listen']>

declare global {
    interface GDeventNames extends NewEventType<'server.start', [isMaster: boolean, app: Express]> { }
}

export async function startServer(isMaster = true) {

    await initGreenDotConfigs()
    await initProjectAndDaosCache()

    const mainConfig = getMainConfig()
    const appConfig = await getActiveAppConfig()

    // CLI INTRO
    if (isMaster) {
        C.gradientize(appConfig.serverCliIntro)
        C.log(C.primary(`Env: ${mainConfig.env} | Schedules: ${appConfig.enableSchedules ? '✓' : '✖️'} | Seeds: ${appConfig.enableSeed ? '✓' : '✖️'}\n`))
        if (DISPLAY_NO_BUILD_WARNING) C.error(false, `✓ LOCAL BUILD NOT RAN`)
        else C.log(C.primary(`✓ BUILD ${appConfig.name}`))
    }

    // SERVER START EVENT
    event.on('database.connected', async () => {
        if (isMaster) {
            C.log(C.primary(`✓ SERVER STARTED: ${appConfig.serverLiveUrl}`))
            C.log(C.dim('Async tasks:'))
        }

        // seed and server.start events shall be triggered before exposing routes.
        // This avoid accidentally hitting a route without seeded content
        await event.emit('server.start', newSystemCtx(), isMaster, app)
    })

    await initDbs()

    registerConfig(appConfig.dataValidationConfig)

    const app = express()

    initTelegramBot()

    // HEADERS SECURITY
    app.disable('x-powered-by') // good security practice to not show that we rely on express under the hood

    app.use((_, res, next) => {
        res.set({
            'Content-Security-Policy': `default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self' 'unsafe-eval';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests`,
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
    // CORS
    app.use(cors({
        credentials: true,
        origin: function (origin, callback) {
            const err = () => {
                callback(new DescriptiveError('Not allowed by CORS: ' + origin, { origin, env: mainConfig.env, code: 500 }))
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
    // MULTIPART
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


    // REGISTER DAO API
    await registerDaoApi(app)

    // REGISTER SERVICES
    const allRoutesFromServices = await registerServices(isMaster)

    // REGISTER SERVICE API
    await registerServiceApi(app, allRoutesFromServices)


    await new Promise(resolve => {
        server = app.listen(appConfig.port, () => resolve(1))
    })


    // ALIVE ROUTE
    app.get('/alive', generateLoginMw(), rateLimiterMiddleware(), (_, res) => res.json(true))

    // Expose a route for killing the server process (allow to emulate servers down)
    if (env.isTest && process.env.NODE_ENV !== 'production') app.get(`/killProcess`, logRouteInfos('Killing Process', '💀'), () => process.exit(0))

    // ASYNC this is async to gain in server loading time
    setTimeout(async () => await startServerAsyncTasks(app), 2000)
}


export async function stopServer() {
    return new Promise(resolve => {
        if (server && server.close) {
            setTimeout(() => {
                C.warning(false, 'Server could not be stopped within 3 seconds. Killing it with no mercy ⚔️💀...')
                resolve(1)
            }, 3000)
            server.close(() => {
                C.info('Server stopped gracefully...')
                resolve(1)
            })
        } else resolve(1)
    })
}
