
import { addMinutes } from 'topkat-utils'
import { getPluginConfig } from '../pluginSystem'


export function setRefreshTokenCookie(ctx: Ctx, refreshToken: string) {

  const isProdLike = ctx.env === 'preprod' || ctx.env === 'production' || ctx.env === 'development'

  const paths = ['/logout', '/get-new-token', '/update-password-with-old-password']

  if (isProdLike) for (const path of paths) setCookie(ctx, 'refreshToken', refreshToken, path)
  else setCookie(ctx, 'refreshToken', refreshToken)
}

export function setCsrfTokenCookie(ctx: Ctx, csrfToken: string) {
  setCookie(ctx, 'csrfToken', csrfToken)
}



function setCookie(ctx: Ctx, cookieName: string, cookieValue: string, path?: string) {

  const { refreshTokenExpirationMinutes } = getPluginConfig('GDmanagedLogin')

  const expireDate = addMinutes(new Date(), refreshTokenExpirationMinutes + 2, 'date')
  const isProdLike = ctx.env === 'preprod' || ctx.env === 'production'

  ctx.api.res.cookie(cookieName, cookieValue, {
    httpOnly: true, // do not allow javascript to access the cookie
    secure: true, // set to true if cookie is set to https or localhost
    sameSite: isProdLike ? 'strict' : 'none', // helps mitigate CSRF attacks
    domain: isProdLike ? '.bangk.app' : undefined, // allow all subdomains or request origin by default
    path, // default to '/'
    expires: expireDate,
  })
}