
import Path from 'path'
import fs from 'fs-extra'
import { serverConfig } from '../../cache/green_dot.app.config.cache'
import { _ } from '../../definitions'
import { RouteConfig, RouteConfigPerPlatforms } from './generateSDKgetRouteConfigs'





export async function generateSwaggerDoc(
  daoConfig: RouteConfigPerPlatforms,
  serviceConfig: RouteConfigPerPlatforms
) {

  const { platformForPermission, appName } = serverConfig
  const allPlatforms = Object.values(platformForPermission)

  const swaggerDocs = {}

  for (const platform of allPlatforms) {

    const merged = [...daoConfig[platform], ...serviceConfig[platform]]

    for (const [, conf] of merged) {
      swaggerDocs[conf.route] = swaggerRoute(conf)
    }
  }

  const jsonDoc = JSON.stringify({
    openapi: '3.1.1',
    info: {
      title: `${appName.replace(/([A-Z])/g, '-$1').toUpperCase()} API`,
      description: 'KOUKOU lé dévlopeure sesi é une doque souagueure',
      termsOfService: 'http://swagger.io/terms/',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'https://api.bangk.app'
      }, {
        url: 'https://dev-api.bangk.app'
      }
    ],
    paths: {
      ...swaggerDocs,
    }
  })

  const path = Path.join(Path.resolve(process.cwd(), `./src/2_generated`), 'swaggerDoc.generated.json')

  await fs.writeFile(path, jsonDoc)
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
        // '400': {
        //   'description': 'Invalid ID supplied'
        // },
      },
    }
  }
}