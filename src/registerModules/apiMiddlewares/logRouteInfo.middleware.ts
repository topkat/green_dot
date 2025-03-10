

import { C } from 'topkat-utils'


export function logRouteInfos(route: string | ((req: ObjectGeneric) => string), serviceName: string) {
    return (req: ObjectGeneric, res, next) => {
        const ctx: Ctx = req.ctx || {}
        const userId = ctx?._id
        const perm = userId && !ctx.isPublic ? userId : 'public'
        const routeStr = typeof route === 'function' ? route(req) : route
        C.success(`${serviceName} <=> ${routeStr} <=> ${perm}`)
        next()
    }
}