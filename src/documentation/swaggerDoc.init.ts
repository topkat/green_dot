
import { Application } from 'express'
import swaggerUi from 'swagger-ui-express'

import { C, urlPathJoin } from 'topkat-utils'

export function swaggerDocInit(app: Application, swaggerDocObject: Record<string, any>, serverUrl: string) {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocObject))
  C.log(C.primary(`✓ Swagger doc served at ${urlPathJoin(serverUrl, '/doc')}`))
}