
import Path from 'path'
import { Express } from 'express'
import { getActiveAppConfig, getMainConfig } from './helpers/getGreenDotConfigs'
import { generateLoginMw } from './security/login.middleware'
import { C, DescriptiveError, urlPathJoin } from 'topkat-utils'
import { rateLimiter } from './security/serviceRouteRateLimiter'
import swaggerUi from 'swagger-ui-express'
import { generateMainBackendFiles } from './generate/generateMainBackendFiles'
import { getExpressErrHandlerMW } from './security/expressErrorHandler.middleware'



export async function startServerAsyncTasks(app: Express) {
  try {
    const mainConfig = getMainConfig()
    const appConfig = await getActiveAppConfig()

    // 404 catch all routes, make sure they are declared after everything (even custom user declared routes)
    app.use(
      generateLoginMw(),
      async (req, res, next) => {
        try {
          C.error(false, `Route not found: ${req.method} ${req.originalUrl}`)
          await rateLimiter.recordAttemptAndThrowIfNeeded((req as any)?.ctx, '404')
          return res.status(404).end()
        } catch (err) {
          next(err)
        }
      }
    )

    app.use(getExpressErrHandlerMW())

    // GENERATE SDK
    if (!mainConfig.isProdEnv) {
      try {
        await generateMainBackendFiles()

        // GENERATE SWAGGER DOC
        const swaggerDoc = await import(Path.resolve(__dirname, `./cache/${appConfig.name}.swaggerDoc.generated.json`))

        app.use('/doc/*', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
        C.log(C.primary(`✓ Swagger doc served at ${urlPathJoin(appConfig.serverLiveUrl, '/doc')}`))

      } catch (err) {
        C.error(err)
        C.warning(false, `Swagger doc could not be generated and initiated`)
      }
    }
  } catch (err) {
    const err2 = err as DescriptiveError
    if (err2 instanceof DescriptiveError) err2.hasBeenLogged = true
    C.error(err)
    C.error(false, 'An error has occurred in ASYNC part of server start. See log above for more informations')
  }
}