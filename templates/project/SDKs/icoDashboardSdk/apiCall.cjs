/* eslint-disable no-console */
const axios = require('axios')
const { capitalize1st, removeCircularJSONstringify, C, generateToken } = require('topkat-utils')

const methodNames = { "service": { "addTransactionInfo": ["backend", "add-transaction-info"], "updateKycStatus": ["backend", "update-kyc-status"], "updateDueDiligenceStatus": ["backend", "update-due-diligence-status"], "kycRequestForRestrictedCountries": ["backend", "kyc-request-for-restricted-countries"], "getKycUrl": ["backend", "get-kyc-url"], "getDueDiligenceUrl": ["backend", "get-due-diligence-url"], "shuftiProCallback": ["backend", "shufti-pro-callback"], "subscribeToNewsletter": ["backend", "subscribe-to-newsletter"], "dataTrackingRegisterEvent": ["backend", "data-tracking-register-event"], "updateEmail": ["backend", "update-email"], "registerUserDevice": ["backend", "register-user-device"], "userSubscribe": ["backend", "user/subscribe"], "updatePassword": ["backend", "update-password"], "sendForgotPasswordEmail": ["backend", "send-forgot-password-email"], "sendValidationEmail": ["backend", "send-validation-email"], "sendUpdateEmail": ["backend", "send-update-email"], "pincodeOrBiometricTokenAuthTestService": ["backend", "pincode-or-biometric-token-auth-test-service"], "deleteUserRequest": ["backend", "delete-user-request"], "checkUserExists": ["backend", "check-user-exists"], "userUpdatePhone": ["backend", "user-update-phone"], "registerCompanyRepresentative": ["backend", "register-company-representative"], "getNewToken": ["backend", "get-new-token"], "validateEmailAndLogin": ["backend", "validate-email-and-login"], "updatePasswordWithOldPassword": ["backend", "update-password-with-old-password"], "checkTokenBeforeEmailSvc": ["backend", "check-token-before-email-svc"], "tokenBgk": ["backend", "token-bgk"], "sendMessageToSupport": ["backend", "send-message-to-support"], "getCryptoChartData": ["backend", "get-crypto-chart-data"], "getCurrencyRateLive": ["backend", "get-currency-rate-live"], "checkTransactionStatus": ["backend", "check-transaction-status"], "getCurrencyRates": ["backend", "get-currency-rates"], "frontendErrorHandler": ["backend", "frontend-error-handler"], "getGeneralBonusCode": ["backend", "get-general-bonus-code"], "createIcoTransaction": ["backend", "create-ico-transaction"], "cancelTransactionByUser": ["backend", "cancel-transaction-by-user"], "icoGetAllReferedUsersWithBGKbonus": ["backend", "ico-get-all-refered-users-with-b-g-kbonus"], "getNbReferralSinceLastPageView": ["backend", "get-nb-referral-since-last-page-view"], "userHasTransactions": ["backend", "user-has-transactions"], "addTransactionBonusCode": ["backend", "add-transaction-bonus-code"], "assignWalletToUser": ["backend", "assign-wallet-to-user"], "isBonusCodeValid": ["backend", "is-bonus-code-valid"], "bangkAdminLogin": ["backend", "bangk-admin/login"], "logout": ["backend", "logout"], "loginOrSubscribe": ["backend", "login-or-subscribe"], "userLoginWithEmail": ["backend", "user/loginWithEmail"] }, "dbRead": { "companyGetAll": "bangk/company/getAll", "companyGetLastN": "bangk/company/getLastN", "companyGetFirstN": "bangk/company/getFirstN", "companyCount": "bangk/company/count", "companyGetById": "bangk/company/getById", "companyGetOne": "bangk/company/getOne", "icoDashboardConfigGetById": "bangk/icoDashboardConfig/getById", "icoDashboardConfigGetOne": "bangk/icoDashboardConfig/getOne", "icoRewardTransactionGetAll": "bangk/icoRewardTransaction/getAll", "icoRewardTransactionGetLastN": "bangk/icoRewardTransaction/getLastN", "icoRewardTransactionGetFirstN": "bangk/icoRewardTransaction/getFirstN", "icoRewardTransactionCount": "bangk/icoRewardTransaction/count", "icoRewardTransactionGetById": "bangk/icoRewardTransaction/getById", "icoRewardTransactionGetOne": "bangk/icoRewardTransaction/getOne", "icoTransactionGetAll": "bangk/icoTransaction/getAll", "icoTransactionGetLastN": "bangk/icoTransaction/getLastN", "icoTransactionGetFirstN": "bangk/icoTransaction/getFirstN", "icoTransactionCount": "bangk/icoTransaction/count", "icoTransactionGetById": "bangk/icoTransaction/getById", "icoTransactionGetOne": "bangk/icoTransaction/getOne", "investmentProjectBondsGetAll": "bangk/investmentProjectBonds/getAll", "investmentProjectBondsGetLastN": "bangk/investmentProjectBonds/getLastN", "investmentProjectBondsGetFirstN": "bangk/investmentProjectBonds/getFirstN", "investmentProjectBondsCount": "bangk/investmentProjectBonds/count", "investmentProjectBondsGetById": "bangk/investmentProjectBonds/getById", "investmentProjectBondsGetOne": "bangk/investmentProjectBonds/getOne", "investmentProjectEquityGetAll": "bangk/investmentProjectEquity/getAll", "investmentProjectEquityGetLastN": "bangk/investmentProjectEquity/getLastN", "investmentProjectEquityGetFirstN": "bangk/investmentProjectEquity/getFirstN", "investmentProjectEquityCount": "bangk/investmentProjectEquity/count", "investmentProjectEquityGetById": "bangk/investmentProjectEquity/getById", "investmentProjectEquityGetOne": "bangk/investmentProjectEquity/getOne", "investmentProjectFundSharesGetAll": "bangk/investmentProjectFundShares/getAll", "investmentProjectFundSharesGetLastN": "bangk/investmentProjectFundShares/getLastN", "investmentProjectFundSharesGetFirstN": "bangk/investmentProjectFundShares/getFirstN", "investmentProjectFundSharesCount": "bangk/investmentProjectFundShares/count", "investmentProjectFundSharesGetById": "bangk/investmentProjectFundShares/getById", "investmentProjectFundSharesGetOne": "bangk/investmentProjectFundShares/getOne", "userGetById": "bangk/user/getById", "userGetOne": "bangk/user/getOne" }, "dbWrite": { "userUpdate": "bangk/user/update", "userUpdateMany": "bangk/user/updateMany", "userUpsert": "bangk/user/upsert", "userUpdateWithFilter": "bangk/user/updateWithFilter" } }

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
    if (err && err.msg) {
        const {
            msg = err && err.response && err.response.statusText,
            code = err.code || err.status || err.response && err.response.status,
            ...extraInfos
        } = err || {}

        const fullMsg = `${code} ${msg}`
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
    Object.keys(serverUrls).forEach(backendName => {
        serverState.serverUrl[backendName] = serverUrls[backendName].replace(/(^\/|\/$)/g, '')
    })
    if (onErrorCallback) onError = onErrorCallback
    if (headers?.platform) platform = headers.platform

    if (localStorageGetRaw) localStorageGet = localStorageGetRaw
    if (localStorageSetRaw) localStorageSet = localStorageSetRaw

    if (localStorageGetRaw) getCsrf = () => localStorageGet('csrfToken')
    if (localStorageSetRaw) setCsrf = csrf => localStorageSet('csrfToken', csrf)

    serverState.headers = headers
    if (getQueryClient) serverState.getQueryClient = getQueryClient
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
                if (sideEffects[queryName]) {
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

                if (isWrite && serverState.getQueryClient?.()) {
                    // invalidate cache for read queries
                    // route    => api/bangkDb/testCard/getOne
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
            } else await onthrow error.getDataClean(data, status), status) /**/
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
module.exports = {
    getServerState,
    onError,
    init,
    setHeaders,
    apiCall,
    registerSideEffect,
    beforeApiCall,
    methodNames,
}