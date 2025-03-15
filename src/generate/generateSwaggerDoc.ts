
import Path from 'path'
import fs from 'fs-extra'
import { RouteConfig, RouteConfigPerPlatforms } from './generateSDK/generateSDKgetRouteConfigs'
import { getMainConfig } from '../helpers/getGreenDotConfigs'
import { getActiveAppConfig } from '../helpers/getGreenDotConfigs'
import { greenDotCacheModuleFolder } from '../helpers/getProjectPaths'
import { C } from 'topkat-utils'
import { _ } from 'good-cop'



export async function generateSwaggerDoc(
  daoConfig: RouteConfigPerPlatforms,
  serviceConfig: RouteConfigPerPlatforms
) {

  const { generateSdkConfig } = getMainConfig()

  if (!generateSdkConfig) return C.error(false, 'No SDK config found')

  const { sdkNameForRole } = generateSdkConfig
  const { name: appName, swaggerDoc, port, folderPath } = await getActiveAppConfig()
  const { copyDocJsonToFolder, descriptionText, enable, serversUrl } = swaggerDoc

  if (enable) {

    const swaggerDocs = {}

    for (const platform of Object.values(sdkNameForRole)) {

      const merged = [...daoConfig[platform], ...serviceConfig[platform]]

      for (const [, conf] of merged) {
        swaggerDocs[conf.route] = swaggerRoute(conf)
      }
    }

    const jsonDoc = JSON.stringify({
      openapi: '3.1.1',
      info: {
        title: `${appName.replace(/([A-Z])/g, ' $1').toUpperCase()} API`,
        description: descriptionText || '🟢 green_dot backend swagger doc',
        termsOfService: 'http://swagger.io/terms/',
        version: '1.0.0'
      },
      servers: [`http://localhost:${port}`, ...(serversUrl || [])].map(url => ({ url })),
      paths: { ...swaggerDocs }
    })

    await fs.outputFile(Path.join(greenDotCacheModuleFolder, `./${appName}.swaggerDoc.generated.json`), jsonDoc)

    if (copyDocJsonToFolder) {
      try {
        const p = copyDocJsonToFolder.startsWith('.') ? Path.resolve(folderPath, copyDocJsonToFolder) : copyDocJsonToFolder
        await fs.outputFile(Path.join(p, 'swaggerDoc.generated.json'), jsonDoc)
      } catch (err) {
        C.error(false, `You provided appConfig.swaggerDoc.copyDocJsonToFolder for app ${appName} but the provided path (${swaggerDoc.copyDocJsonToFolder}) does not exist or there were a problem with copying file. Please make sure path is absolute OR relative starting with a dot (./folder)`)
      }
    }

  }
}


//  ╔═══ ╦  ╦ ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗   ╔══╗ ╔══╗ ╦  ╦ ══╦══ ╔══╗
//  ╚══╗ ║╔╗║ ╠══╣ ║ ═╦ ║ ═╦ ╠═   ╠═╦╝   ╠═╦╝ ║  ║ ║  ║   ║   ╠═
//  ═══╝ ╩╝╚╩ ╩  ╩ ╚══╝ ╚══╝ ╚══╝ ╩ ╚    ╩ ╚  ╚══╝ ╚══╝   ╩   ╚══╝
function swaggerRoute(routeConfig: RouteConfig) {

  const { method = 'POST', doc, inputValidator, outputValidator, queryName } = routeConfig

  const errors = {} as Record<string, { description: string }>
  if (doc?.errors) {
    for (const [code, description] of doc.errors) {
      if (!errors[code]) errors[code] = { description: '' }
      else errors[code].description += ' OR '
      errors[code].description += description
    }
  }

  return {
    [method.toLocaleLowerCase()]: {
      summary: doc?.description,
      description: doc?.description,
      operationId: queryName,
      requestBody: {
        content: {
          'application/json': {
            'schema': (Array.isArray(inputValidator) ? _.tuple(inputValidator) : inputValidator).getSwaggerType()
          },
        },
        required: true
      },
      responses: {
        200: {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: (outputValidator || _.void()).getSwaggerType()
            },
          }
        },
        ...errors,
        // FORMAT
        // '400': {
        //   'description': 'Invalid ID supplied'
        // },
      },
    }
  }
}