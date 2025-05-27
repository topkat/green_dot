import { svc } from '../../../service'
import { revokeToken } from '../userAuthenticationTokenService'



export function getLogoutService() {
  return {
    logout: svc({
      for: ['public', 'ALL'],
      doc: `The cookie is cleared and token is revoked`,
      async main(ctx) {
        const refreshToken = ctx.api.req?.cookies?.refreshToken || (ctx.env === 'test' && ctx.api.req?.headers?.refreshtoken)
        if (refreshToken) {
          ctx.api.res.clearCookie('refreshToken')
          await revokeToken(ctx, ctx._id, refreshToken)
        }
        await revokeToken(ctx, ctx._id, ctx.api.req?.headers?.authorization, 'accessTokens')
      },
    })
  }
}