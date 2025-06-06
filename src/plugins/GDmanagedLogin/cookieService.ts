
import { addMinutes } from 'topkat-utils'
import { PluginUserConfig } from './config.js'
import { env } from '../../helpers/getEnv.js'



export function setRefreshTokenCookie(ctx: Ctx, refreshToken: string, config: PluginUserConfig) {

  const isProdLike = ctx.env === 'preprod' || ctx.env === 'production' || ctx.env === 'development'

  const paths = ['/logout', '/get-new-token', '/update-password-with-old-password']

  if (isProdLike) for (const path of paths) setCookie(ctx, 'refreshToken', refreshToken, config, path)
  else setCookie(ctx, 'refreshToken', refreshToken, config)
}

export function setCsrfTokenCookie(ctx: Ctx, csrfToken: string, config: PluginUserConfig) {
  setCookie(ctx, 'csrfToken', csrfToken, config)
}



function setCookie(
  ctx: Ctx,
  cookieName: string,
  cookieValue: string,
  config: PluginUserConfig,
  path?: string
) {

  const expireDate = addMinutes(new Date(), config.refreshTokenExpirationMinutes + 2, 'date')

  ctx.api.res.cookie(cookieName, cookieValue, {
    httpOnly: true, // do not allow javascript to access the cookie
    secure: true, // set to true if cookie is set to https or localhost
    sameSite: env.isProd ? 'strict' : 'none', // helps mitigate CSRF attacks
    domain: env.isProd ? config.cookieProductionDomain : undefined, // allow all subdomains or request origin by default
    path, // default to '/'
    expires: expireDate,
  })
}