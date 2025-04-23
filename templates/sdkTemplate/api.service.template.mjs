

import { apiCall, init, onError, getServerState, setHeaders, beforeApiCall, registerSideEffect, methodNames } from './apiCall.mjs'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ensureAccessToken, getActualScreen, getHandleErrorTyped, initTrackerData, sendDataToServer, trackerEvent, handleError, initErrorHandler, log, initHelpers, logout, setAccessToken } from './sdkHelpers'
import { initBackend, isBackendInitialized } from './sdkHelpers/initBackend'
import { imgData } from './img'

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
    img(img, overrideBreakpoint) {
        const breakpoint = overrideBreakpoint || actualBreakpoint
        return imgData[`${img}-${breakpoint}`] || imgData[img] || 'https://media.tenor.com/nsNAI7AW4awAAAAM/cock-cockblock.gif'
    },
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
        })
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
    else throw new Error('Please pass reactQuery "getQueryClient" when initializing backend')
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
 * @param {string | [string, string]} route
 */
function getServerAndRoute(route) {
    const [server, rte] = Array.isArray(route) ? route : ['default', route || '/']
    return { server, route: rte }
}

/** BREAKPOINTS */
let actualBreakpoint
const setBreakpoint = breakpoint => actualBreakpoint = breakpoint

'%%queriesToInvalidate%%'

/** /!\ Do not export individually (commonJs compatible) */
export { $, methodNames, getActualScreen, initTrackerData, sendDataToServer, trackerEvent, log, getHandleErrorTyped, handleError, initErrorHandler, ensureAccessToken, initBackend, logout, setAccessToken, isBackendInitialized }