

import { apiCall, init, onError, getServerState, setHeaders, beforeApiCall, registerSideEffect, methodNames } from './apiCall.js'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ensureAccessToken, getActualScreen, getHandleErrorTyped, initTrackerData, sendDataToServer, trackerEvent, handleError, initErrorHandler, log, initHelpers, logout, setAccessToken } from './sdkHelpers/index.js'
import { initSdk, isSdkInitialized } from './sdkHelpers/initSdk.js'

/** Used to store the timeouts of deferred requests */
const deferTimeout = {}

const allMethods = { ...methodNames.dbRead, ...methodNames.dbWrite, ...methodNames.service }
const allMethodNames = Object.keys(allMethods)

const $ = new Proxy({
    init: (props) => {
        const { apiKey, ...otherProps } = props
        init({ ...otherProps, headers: { apiKey, platform: '%%appName%%' } })
    },
    getServerUrl: () => getServerState().serverUrl,
    setHeaders: (...params) => setHeaders(...params),
    setAuthorization: (authToken) => setHeaders({ authorization: authToken }, true),
    beforeApiCall: (...params) => beforeApiCall(...params),
    invalidateQueries: queries => invalidateQueries(queries),
    setBreakpoint: breakpoint => setBreakpoint(breakpoint),
    auth: {
        pinCode: pinCode => setHeaders({ pinCode: pinCode.toString() }),
        biometricAuthToken: biometricAuthToken => setHeaders({ biometricAuthToken }),
        _2FA: _2FA => setHeaders({ _2FA }),
    },
}, {
    get(obj, key) {
        if (obj[key]) {
            return obj[key] // Base Object method
        } else if (functionMapping[key]) {
            return new Proxy({}, { get: (_, k) => functionMapping[key](k) }) // useQuery, defer, prefetch...
        } else {
            return (...params) => {
                const { server, route } = getServerAndRoute(allMethods?.[key] || key)
                return apiCall(server, key, route || key, ...params) // one of generated methods or 404
            }
        }
    }
})

initHelpers($)

const functionMapping = {
    defer: k => (...params) => defer(k, allMethods[k], ...params),
    prefetch: k => (queryOptions, ...params) => prefetchQuery(allMethods[k], k, params, queryOptions),
    addQueriesToInvalidate: k => queriesToInvalidate => registerSideEffect(k, queriesToInvalidate),
    useQuery: k => (queryOptions = {}, ...params) => {
        const { server, route } = getServerAndRoute(allMethods[k])
        const { data, ...otherFields } = useSuspenseQuery({
            queryKey: [k, ...params],
            queryFn: () => apiCall(server, k, route, ...params),
            ...queryOptions
        }, getServerState().getQueryClient())
        return [data, otherFields]
    },
}

function prefetchQuery(route2, queryName, params, queryOptions = {}) {
    const { server, route } = getServerAndRoute(route2)
    if (getServerState().getQueryClient()) return getServerState().getQueryClient()?.prefetchQuery({
        queryKey: [queryName, ...params],
        queryFn: () => apiCall(server, queryName, route, ...params),
        ...queryOptions
    })
    else throw new Error('Please pass reactQuery "getQueryClient" when initializing SDK')
}

function defer(queryName, route2, ...params) {
    const { server, route } = getServerAndRoute(route2)
    clearTimeout(deferTimeout[queryName])
    deferTimeout[queryName] = setTimeout(async () => {
        try {
            await apiCall(server, queryName, route, ...params)
        } catch (error) { onError(error) }
    }, 3000)
}

function invalidateQueries(queries) {
    for (const query of queries) {
        if (query.endsWith('*')) {
            for (const query of allMethodNames) {
                if (query.startsWith(query)) getServerState().getQueryClient().invalidateQueries({ queryKey: [query] })
            }
        } else getServerState().getQueryClient().invalidateQueries({ queryKey: [query] })
    }
}

/**
 * @param {string | { server: string, route: string }} route
 */
function getServerAndRoute(route) {
    const { server, route: rte } = route && typeof route === 'object' && 'server' in route ? route : { server: 'default', route: route || '/' }
    return { server, route: rte }
}

/** CSS BREAKPOINTS TODO feature: the app automatically serve optimized images depending on the css breakpoint */
let actualBreakpoint
const setBreakpoint = breakpoint => actualBreakpoint = breakpoint

'%%queriesToInvalidate%%'

/** /!\ Do not export individually (commonJs compatible) */
export { $, methodNames, getActualScreen, initTrackerData, sendDataToServer, trackerEvent, log, getHandleErrorTyped, handleError, initErrorHandler, ensureAccessToken, initSdk, logout, setAccessToken, isSdkInitialized }

/**%%export_all*/