
import { CtxClass, publicUserId } from '../ctx'
import { Request } from 'express'
import { getActiveAppConfig } from '../helpers/getGreenDotConfigs'

export function generateLoginMw() {
    return async function loginMw(req: Request & { ctx: any }, res, next) {
        try {
            const appConfig = await getActiveAppConfig()

            const defaultCtx = {
                _id: publicUserId,
                role: 'public',
                platform: req.headers.platform as string,
                permissions: {},
                authenticationMethod: [],
            } satisfies CtxUser

            const ctxUser = await appConfig.connexionFn(defaultCtx, req, res)

            const ctx = new CtxClass(ctxUser, req, res, (req as any)?.ctx)

            req.ctx = ctx

            next()

        } catch (err) {
            next(err)
        }
    }
}