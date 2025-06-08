
import { CtxClass, publicUserId } from '../ctx.js'
import { Request } from 'express'
import { getActiveAppConfig } from '../helpers/getGreenDotConfigs.js'
import { getPluginHook } from '../plugins/pluginSystem.js'

export function generateLoginMw() {
    return async function loginMw(req: Request & { ctx: any }, res, next) {
        try {
            const appConfig = await getActiveAppConfig()
            const onLoginHooks = getPluginHook('onLogin')

            const ctxUser = {
                _id: publicUserId,
                role: 'public',
                platform: req.headers.platform as string,
                permissions: {},
                authenticationMethod: [],
            } satisfies CtxUser

            if (typeof appConfig.onBeforeLoginCallback === 'function') await appConfig.onBeforeLoginCallback(ctxUser, req, res)

            for (const hook of onLoginHooks) {
                await hook.callback(ctxUser, req, res)
            }

            if (typeof appConfig.onAfterLoginCallback === 'function') await appConfig.onAfterLoginCallback(ctxUser, req, res)

            const ctx = new CtxClass(ctxUser, req, res, (req as any)?.ctx)

            req.ctx = ctx

            next()

        } catch (err) {
            next(err)
        }
    }
}