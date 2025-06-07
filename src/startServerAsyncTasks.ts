import Path from 'path'
import { Express } from 'express'
import { getActiveAppConfig, getMainConfig } from './helpers/getGreenDotConfigs.js'
import { generateLoginMw } from './security/login.middleware.js'
import { C, DescriptiveError, urlPathJoin } from 'topkat-utils'
import { rateLimiter } from './security/serviceRouteRateLimiter.js'
import swaggerUi from 'swagger-ui-express'
import { getExpressErrHandlerMW } from './security/expressErrorHandler.middleware.js'
import { generateMainBackendFiles } from './generate/generateMainBackendFiles.js'
import { greenDotCacheModuleFolder } from './helpers/getProjectPaths.js'
import fs from 'fs'



export async function startServerAsyncTasks(app: Express) {
  try {
    const mainConfig = getMainConfig()
    const appConfig = await getActiveAppConfig()

    // GENERATE SDK
    if (!mainConfig.isProdEnv) {
      try {

        await generateMainBackendFiles(appConfig, { generateSdk: false, doGenerateSwaggerDoc: true })

        // GENERATE SWAGGER DOC
        const swaggerDoc = JSON.parse(fs.readFileSync(Path.join(greenDotCacheModuleFolder, `${appConfig.name}.swaggerDoc.generated.json`), 'utf-8'))

        // Serve the Swagger JSON
        app.get('/doc/swagger.json', (req, res) => {
          res.json(swaggerDoc)
        })

        const swaggerOptions = {
          swaggerOptions: {
            urls: [{
              url: urlPathJoin(appConfig.serverLiveUrl, `/doc/swagger.json`),
              name: 'API Documentation'
            }]
          }
        }

        app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc, swaggerOptions))

        C.log(C.primary(`✓ Swagger doc served at ${urlPathJoin(appConfig.serverLiveUrl, '/doc')}`))

      } catch (err) {
        C.error(err)
        C.warning(false, `Swagger doc could not be generated and initiated`)
      }
    }


    app.use(getExpressErrHandlerMW())


    setTimeout(() => {
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
    }, 300)

  } catch (err) {
    const err2 = err as DescriptiveError
    if (err2 instanceof DescriptiveError) err2.hasBeenLogged = true
    C.error(err)
    C.error(false, 'An error has occurred in ASYNC part of server start. See log above for more informations')
  }
}