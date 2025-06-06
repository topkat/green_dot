import * as fs from 'fs-extra'
import path from 'path'

import { capitalize1st } from 'topkat-utils'
import { getActiveAppConfig } from '../helpers/getGreenDotConfigs.js'

export default async function generateAllRouteFile(allRoutes: string[]) {

    const appConfig = await getActiveAppConfig()

    type RouteObj = Record<string, string>
    const routeObjForTestEnv: RouteObj = {}

    for (const route of allRoutes) {
        if (
            !route.includes('mongo') // TODO is this still relevant
        ) {
            const routeClean = route
                .replace(/^\//g, '')
                .replace(/\//g, '_')
                .split('-')
                .map((word, i) => i !== 0 ? capitalize1st(word) : word)
                .join('')

            if ('filterRoutesForTest' in appConfig === false || appConfig.filterRoutesForTest(route)) routeObjForTestEnv[routeClean] = route
        }
    }

    /** This is to make sure that when everything is cleared and reset, the existing tests using
    all routes will not throw a type error */
    const hasNoRouteType = Object.keys(routeObjForTestEnv).length === 0 ? ' as any' : ''

    await fs.outputFile(path.join(appConfig.generatedFolderPath, 'all-routes-for-tests.generated.ts'), `
export const allRoutes = ${JSON.stringify(routeObjForTestEnv, null, 2)}${hasNoRouteType}

export type RoutesEnum = keyof typeof allRoutes`)
}