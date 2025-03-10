import * as fs from 'fs-extra'
import path from 'path'
import { serverConfig } from '../cache/green_dot.app.config.cache'

import { capitalize1st } from 'topkat-utils'

export default async function generateAllRouteFile(allRoutes: string[]) {
    type RouteObj = Record<string, string>
    const routeObjForTestEnv: RouteObj = {}

    for (const route of allRoutes) {
        if (
            !route.includes('mongo') || route.includes('bangk')
        ) {
            const routeClean = route
                .replace(/^\//g, '')
                .replace(/\//g, '_')
                .split('-')
                .map((word, i) => i !== 0 ? capitalize1st(word) : word)
                .join('')

            if ('filterRoutesForTest' in serverConfig === false || serverConfig.filterRoutesForTest(route)) routeObjForTestEnv[routeClean] = route
        }
    }

    /** This is to make sure that when everything is cleared and reset, the existing tests using
    all routes will not throw a type error */
    const hasNoRouteType = Object.keys(routeObjForTestEnv).length === 0 ? ' as any' : ''

    await fs.outputFile(path.join(path.resolve(process.cwd(), `./src/2_generated`), 'all-routes-for-tests.generated.ts'), `
export const allRoutes = ${JSON.stringify(routeObjForTestEnv, null, 2)}${hasNoRouteType}

export type RoutesEnum = keyof typeof allRoutes`)
}