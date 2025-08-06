/* eslint-disable no-console */
import axios from 'axios'
import { capitalize1st, removeCircularJSONstringify, C, generateToken } from 'topkat-utils'
import { QueryClient } from '@tanstack/react-query'

const methodNames = '%%AllReadMethodsAndService%%'

const readMethodNamesAndServices = [...Object.keys(methodNames.service), ...Object.keys(methodNames.dbRead)]

let platform = 'undefined'

const serverState = {
    hasBeenInitialised: false,
    serverUrl: {},
    headers: {},
}

let csrf = generateToken(24, false) // fallback to cache
/** LOCAL STORAGE */
let getCsrf = () => csrf
let setCsrf = csrf2 => csrf = csrf2
let localStorageGet = () => undefined
let localStorageSet = () => null
/** React query */
const sideEffects = {}


const getServerState = () => serverState

let onError = (err, status) => {
    if (err && err.message) {
        const {
            message = err && err.response && err.response.statusText,
            code = err.code || err.status || err.response && err.response.status,
            ...extraInfos
        } = err || {}

        const fullMsg = `${code} ${message}`
        const content = JSON.stringify(extraInfos, null, 2)
            .replace(/^ {2}(\s*)"([^"]+)"/gm, '$1$2')
            .replace(/(^{|}$)/g, '')

        console.error(fullMsg, content)
    } else {
        console.error(status + ' ' + removeCircularJSONstringify(err))
    }
}

function init({
    serverUrls,
    onErrorCallback,
    headers = {},
    getQueryClient,
    localStorageGet: localStorageGetRaw,
    localStorageSet: localStorageSetRaw,
}) {
    Object.keys(serverUrls).forEach(sdkName => {
        serverState.serverUrl[sdkName] = serverUrls[sdkName].replace(/(^\/|\/$)/g, '')
    })
    if (onErrorCallback) onError = onErrorCallback
    if (headers?.platform) platform = headers.platform

    if (localStorageGetRaw) localStorageGet = localStorageGetRaw
    if (localStorageSetRaw) localStorageSet = localStorageSetRaw

    if (localStorageGetRaw) getCsrf = () => localStorageGet('csrfToken')
    if (localStorageSetRaw) setCsrf = csrf => localStorageSet('csrfToken', csrf)

    serverState.headers = headers
    if (getQueryClient) serverState.getQueryClient = getQueryClient
    else serverState.getQueryClient = new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity, retry: 0, } }
    })
    serverState.hasBeenInitialised = true
}

function setHeaders(newHeaders, mergeWithPrevious = true) {
    if (mergeWithPrevious) Object.assign(serverState.headers, newHeaders)
    else serverState.headers = { ...newHeaders, platform }
}

const readMethods = ['getById', 'getOne', 'getAll', 'getLastN', 'getFirstN', 'count']
const readMethodsCapitalized = readMethods.map(meth => capitalize1st(meth))

async function apiCall(
    server,
    queryName,
    route,
    ...params
) {
    if (serverState.hasBeenInitialised) {
        await beforeApiCallFnCache(route, ...params)
        try {

            let baseUrl
            if (server === 'default') baseUrl = serverState.serverUrl[serverState.serverUrl?.default]
            else if (Object.keys(serverState.serverUrl).includes(server)) baseUrl = serverState.serverUrl[server]
            else C.error(`Server ${server} not found in config. Available servers: ${serverState.serverUrl.join(', ')}. Please check that you correctly initialized the SDK`)

            const fullUrl = [baseUrl, route.replace(/^\//, '')].join('/')
            const csrfToken = getCsrf()
            if (csrfToken) serverState.headers['X-CSRF-Token'] = csrfToken
            const accessToken = localStorageGet('accessToken')
            if (accessToken) serverState.headers['authorization'] = accessToken

            // we still are on the sync part of the code so it's safer to delete those there and to reinject
            // them as a local function so we are sure that the header apply only on the chosen request
            // and not on a subsequent async request
            const oneShotHeaders = deleteOneShotHeaders()

            const { data, status } = await axios.post(
                fullUrl,
                { params },
                {
                    withCredentials: true,
                    headers: { ...oneShotHeaders, ...serverState.headers },
                    validateStatus: function (status) {
                        return status < 500 // Resolve only if the status code is less than 500
                    }
                }
            )

            if (status === 200) {
                if (sideEffects[queryName] && serverState.getQueryClient) {
                    for (const queryToInvalidate of sideEffects[queryName]) {
                        const queries = []
                        if (queryToInvalidate.endsWith('*')) {
                            const queryToInvalidateWithoutWildcard = queryToInvalidate.replace(/\*/g, '')
                            queries.push(...readMethodNamesAndServices.filter(m => m.startsWith(queryToInvalidateWithoutWildcard)))
                        } else queries.push(queryToInvalidate)
                        for (const query of queries) {
                            serverState.getQueryClient?.()?.invalidateQueries({ queryKey: [query] })
                        }
                    }
                }

                const isWrite = readMethods.every(method => !route.includes(method))

                if (isWrite && serverState.getQueryClient) {
                    // invalidate cache for read queries
                    // route    => api/myDb/testCard/getOne
                    // queryKey => testCardGetOne
                    const [, modelName] = route.split('/').reverse()
                    readMethodsCapitalized.forEach(rm => {
                        const queryKey = modelName + rm
                        serverState.getQueryClient().invalidateQueries({ queryKey: [queryKey] })
                    })
                }
                const data2 = getDataClean(data, status)
                if (data2?.csrfToken) setCsrf(data2.csrfToken)
                return data2
            } else await onError(getDataClean(data, status), status) /**/
        } catch (err) {
            await onError(err.response && err.response.data || err.data || err)
        }
        return null
    } else C.error(false, 'Api service has not been initialized. Please use apiService.init() before using apiService')
}

let beforeApiCallFnCache = () => true

async function beforeApiCall(fn) {
    beforeApiCallFnCache = fn
}

function registerSideEffect(queryName, queriesToInvalidate) {
    sideEffects[queryName] = queriesToInvalidate
}

function getDataClean(data, status) {
    return data === '' // conversion problem express <=> axios
        || data === undefined // react query doesn't support returning undefined
        ? status !== 200 ? { code: status } : null
        : data
}

const headersToDelete = ['pinCode', 'biometricAuthToken', '_2FA']
/** One shot headers are headers that are set only for one request */
function deleteOneShotHeaders() {
    const oneShotHeaders = {}
    for (const headerToDelete of headersToDelete) {
        if (serverState.headers[headerToDelete]) {
            oneShotHeaders[headerToDelete] = serverState.headers[headerToDelete]
            delete serverState.headers[headerToDelete]
        }
    }
    return oneShotHeaders
}

/** /!\ Do not export individually (commonJs compatible) */
export {
    getServerState,
    onError,
    init,
    setHeaders,
    apiCall,
    registerSideEffect,
    beforeApiCall,
    methodNames,
}