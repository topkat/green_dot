
import { objEntries } from 'topkat-utils'
import { ctx } from '../../ctx.js'
import { GreenDotAppConfig } from '../../types/appConfig.types.js'
import type { GDapiKeyAuthentication } from './main.js'

//  ╔══╗ ╔══╗ ═╦═   ╦ ╔  ╔══╗ ╦   ╦
//  ╠══╣ ╠══╝  ║    ╠═╩╗ ╠═   ╚═╦═╝
//  ╩  ╩ ╩    ═╩═   ╩  ╚ ╚══╝   ╩

export function getOnLogin(gdApiKeyAuth: GDapiKeyAuthentication): GreenDotAppConfig['onLoginCallback'] {
  return async (ctxUser: CtxUser, req) => {
    if (ctxUser.role === 'public') {
      const apiKey = req?.headers?.apikey
      const [apiKeyName, apiKeyServer] = objEntries(gdApiKeyAuth.config.apiKeys || {}).find(([, config]) => config.token === apiKey) || []
      if (apiKey && apiKeyServer) {
        const { _id: userId, role, permissions } = apiKeyServer
        if (role as any === 'system') Object.assign(ctxUser, ctx.GM)
        else {
          if (userId) ctxUser._id = userId
          if (role) ctxUser.role = role
          else if (apiKeyName) ctxUser.role = apiKeyName as any // TODO
          if (permissions) ctxUser.permissions = permissions as any
        }
        ctxUser.authenticationMethod.push('apiKey')
      }
    }
  }
}
