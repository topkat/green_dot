
import { CtxClass } from '../ctx'
import { serverConfig } from '../cache/green_dot.app.config.cache'
import { Request } from 'express'

export function generateLoginMw() {
    return async function loginMw(req: Request & { ctx: any }, res, next) {
        try {
            const { onLogin } = serverConfig
            const ctxUser = await onLogin(req)
            const ctx = new CtxClass(ctxUser, req, res, (req as any)?.ctx)
            req.ctx = ctx
            next()
        } catch (err) {
            next(err)
        }
    }
}