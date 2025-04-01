/* eslint-disable no-console */
const axios = require('axios')
const { capitalize1st, removeCircularJSONstringify, C, generateToken } = require('topkat-utils')

const methodNames = { "service": { "manageDueDiligenceStatusAsAdmin": ["backend", "manage-due-diligence-status-as-admin"], "manageKycStatusAsAdmin": ["backend", "manage-kyc-status-as-admin"], "shuftiProCallback": ["backend", "shufti-pro-callback"], "subscribeToNewsletter": ["backend", "subscribe-to-newsletter"], "dataTrackingRegisterEvent": ["backend", "data-tracking-register-event"], "updateEmail": ["backend", "update-email"], "registerUserDevice": ["backend", "register-user-device"], "userSubscribe": ["backend", "user/subscribe"], "updatePassword": ["backend", "update-password"], "sendForgotPasswordEmail": ["backend", "send-forgot-password-email"], "sendValidationEmail": ["backend", "send-validation-email"], "checkUserExists": ["backend", "check-user-exists"], "registerCompanyRepresentative": ["backend", "register-company-representative"], "getNewToken": ["backend", "get-new-token"], "validateEmailAndLogin": ["backend", "validate-email-and-login"], "checkTokenBeforeEmailSvc": ["backend", "check-token-before-email-svc"], "tokenBgk": ["backend", "token-bgk"], "sendMessageToSupport": ["backend", "send-message-to-support"], "getCryptoChartData": ["backend", "get-crypto-chart-data"], "getCurrencyRateLive": ["backend", "get-currency-rate-live"], "getCurrencyRates": ["backend", "get-currency-rates"], "uploadMediasToS3": ["backend", "upload-medias-to-s3"], "frontendErrorHandler": ["backend", "frontend-error-handler"], "getGeneralBonusCode": ["backend", "get-general-bonus-code"], "icoTransactionSuccessHandler": ["backend", "ico-transaction-success-handler"], "cbwaa": ["backend", "cbwaa"], "isBonusCodeValid": ["backend", "is-bonus-code-valid"], "createIcoBonusCode": ["backend", "create-ico-bonus-code"], "bangkAdminLogin": ["backend", "bangk-admin/login"], "logout": ["backend", "logout"], "loginOrSubscribe": ["backend", "login-or-subscribe"], "userLoginWithEmail": ["backend", "user/loginWithEmail"], "plaidGetLinkToken": ["backend", "plaid-get-link-token"], "plaidStoreToken": ["backend", "plaid-store-token"], "plaidGetAllTransactions": ["backend", "plaid-get-all-transactions"] }, "dbRead": { "newsletterSubscriptionsGetAll": "website/newsletterSubscriptions/getAll", "newsletterSubscriptionsGetLastN": "website/newsletterSubscriptions/getLastN", "newsletterSubscriptionsGetFirstN": "website/newsletterSubscriptions/getFirstN", "newsletterSubscriptionsCount": "website/newsletterSubscriptions/count", "newsletterSubscriptionsGetById": "website/newsletterSubscriptions/getById", "newsletterSubscriptionsGetOne": "website/newsletterSubscriptions/getOne", "appConfigGetAll": "bangk/appConfig/getAll", "appConfigGetLastN": "bangk/appConfig/getLastN", "appConfigGetFirstN": "bangk/appConfig/getFirstN", "appConfigCount": "bangk/appConfig/count", "appConfigGetById": "bangk/appConfig/getById", "appConfigGetOne": "bangk/appConfig/getOne", "bangkWalletsGetAll": "bangk/bangkWallets/getAll", "bangkWalletsGetLastN": "bangk/bangkWallets/getLastN", "bangkWalletsGetFirstN": "bangk/bangkWallets/getFirstN", "bangkWalletsCount": "bangk/bangkWallets/count", "bangkWalletsGetById": "bangk/bangkWallets/getById", "bangkWalletsGetOne": "bangk/bangkWallets/getOne", "blockchainConfigGetAll": "bangk/blockchainConfig/getAll", "blockchainConfigGetLastN": "bangk/blockchainConfig/getLastN", "blockchainConfigGetFirstN": "bangk/blockchainConfig/getFirstN", "blockchainConfigCount": "bangk/blockchainConfig/count", "blockchainConfigGetById": "bangk/blockchainConfig/getById", "blockchainConfigGetOne": "bangk/blockchainConfig/getOne", "cardGetAll": "bangk/card/getAll", "cardGetLastN": "bangk/card/getLastN", "cardGetFirstN": "bangk/card/getFirstN", "cardCount": "bangk/card/count", "cardGetById": "bangk/card/getById", "cardGetOne": "bangk/card/getOne", "cardTransactionGetAll": "bangk/cardTransaction/getAll", "cardTransactionGetLastN": "bangk/cardTransaction/getLastN", "cardTransactionGetFirstN": "bangk/cardTransaction/getFirstN", "cardTransactionCount": "bangk/cardTransaction/count", "cardTransactionGetById": "bangk/cardTransaction/getById", "cardTransactionGetOne": "bangk/cardTransaction/getOne", "companyGetAll": "bangk/company/getAll", "companyGetLastN": "bangk/company/getLastN", "companyGetFirstN": "bangk/company/getFirstN", "companyCount": "bangk/company/count", "companyGetById": "bangk/company/getById", "companyGetOne": "bangk/company/getOne", "devCommentGetAll": "bangk/devComment/getAll", "devCommentGetLastN": "bangk/devComment/getLastN", "devCommentGetFirstN": "bangk/devComment/getFirstN", "devCommentCount": "bangk/devComment/count", "devCommentGetById": "bangk/devComment/getById", "devCommentGetOne": "bangk/devComment/getOne", "deviceGetAll": "bangk/device/getAll", "deviceGetLastN": "bangk/device/getLastN", "deviceGetFirstN": "bangk/device/getFirstN", "deviceCount": "bangk/device/count", "deviceGetById": "bangk/device/getById", "deviceGetOne": "bangk/device/getOne", "icoBonusCodeGetAll": "bangk/icoBonusCode/getAll", "icoBonusCodeGetLastN": "bangk/icoBonusCode/getLastN", "icoBonusCodeGetFirstN": "bangk/icoBonusCode/getFirstN", "icoBonusCodeCount": "bangk/icoBonusCode/count", "icoBonusCodeGetById": "bangk/icoBonusCode/getById", "icoBonusCodeGetOne": "bangk/icoBonusCode/getOne", "icoDashboardConfigGetAll": "bangk/icoDashboardConfig/getAll", "icoDashboardConfigGetLastN": "bangk/icoDashboardConfig/getLastN", "icoDashboardConfigGetFirstN": "bangk/icoDashboardConfig/getFirstN", "icoDashboardConfigCount": "bangk/icoDashboardConfig/count", "icoDashboardConfigGetById": "bangk/icoDashboardConfig/getById", "icoDashboardConfigGetOne": "bangk/icoDashboardConfig/getOne", "icoRewardTransactionGetAll": "bangk/icoRewardTransaction/getAll", "icoRewardTransactionGetLastN": "bangk/icoRewardTransaction/getLastN", "icoRewardTransactionGetFirstN": "bangk/icoRewardTransaction/getFirstN", "icoRewardTransactionCount": "bangk/icoRewardTransaction/count", "icoRewardTransactionGetById": "bangk/icoRewardTransaction/getById", "icoRewardTransactionGetOne": "bangk/icoRewardTransaction/getOne", "icoTransactionGetAll": "bangk/icoTransaction/getAll", "icoTransactionGetLastN": "bangk/icoTransaction/getLastN", "icoTransactionGetFirstN": "bangk/icoTransaction/getFirstN", "icoTransactionCount": "bangk/icoTransaction/count", "icoTransactionGetById": "bangk/icoTransaction/getById", "icoTransactionGetOne": "bangk/icoTransaction/getOne", "icoWalletTransactionToValidateManuallyGetAll": "bangk/icoWalletTransactionToValidateManually/getAll", "icoWalletTransactionToValidateManuallyGetLastN": "bangk/icoWalletTransactionToValidateManually/getLastN", "icoWalletTransactionToValidateManuallyGetFirstN": "bangk/icoWalletTransactionToValidateManually/getFirstN", "icoWalletTransactionToValidateManuallyCount": "bangk/icoWalletTransactionToValidateManually/count", "icoWalletTransactionToValidateManuallyGetById": "bangk/icoWalletTransactionToValidateManually/getById", "icoWalletTransactionToValidateManuallyGetOne": "bangk/icoWalletTransactionToValidateManually/getOne", "interestTransactionGetAll": "bangk/interestTransaction/getAll", "interestTransactionGetLastN": "bangk/interestTransaction/getLastN", "interestTransactionGetFirstN": "bangk/interestTransaction/getFirstN", "interestTransactionCount": "bangk/interestTransaction/count", "interestTransactionGetById": "bangk/interestTransaction/getById", "interestTransactionGetOne": "bangk/interestTransaction/getOne", "investmentBondsGetAll": "bangk/investmentBonds/getAll", "investmentBondsGetLastN": "bangk/investmentBonds/getLastN", "investmentBondsGetFirstN": "bangk/investmentBonds/getFirstN", "investmentBondsCount": "bangk/investmentBonds/count", "investmentBondsGetById": "bangk/investmentBonds/getById", "investmentBondsGetOne": "bangk/investmentBonds/getOne", "investmentEquityGetAll": "bangk/investmentEquity/getAll", "investmentEquityGetLastN": "bangk/investmentEquity/getLastN", "investmentEquityGetFirstN": "bangk/investmentEquity/getFirstN", "investmentEquityCount": "bangk/investmentEquity/count", "investmentEquityGetById": "bangk/investmentEquity/getById", "investmentEquityGetOne": "bangk/investmentEquity/getOne", "investmentFundSharesGetAll": "bangk/investmentFundShares/getAll", "investmentFundSharesGetLastN": "bangk/investmentFundShares/getLastN", "investmentFundSharesGetFirstN": "bangk/investmentFundShares/getFirstN", "investmentFundSharesCount": "bangk/investmentFundShares/count", "investmentFundSharesGetById": "bangk/investmentFundShares/getById", "investmentFundSharesGetOne": "bangk/investmentFundShares/getOne", "investmentProjectBondsGetAll": "bangk/investmentProjectBonds/getAll", "investmentProjectBondsGetLastN": "bangk/investmentProjectBonds/getLastN", "investmentProjectBondsGetFirstN": "bangk/investmentProjectBonds/getFirstN", "investmentProjectBondsCount": "bangk/investmentProjectBonds/count", "investmentProjectBondsGetById": "bangk/investmentProjectBonds/getById", "investmentProjectBondsGetOne": "bangk/investmentProjectBonds/getOne", "investmentProjectEquityGetAll": "bangk/investmentProjectEquity/getAll", "investmentProjectEquityGetLastN": "bangk/investmentProjectEquity/getLastN", "investmentProjectEquityGetFirstN": "bangk/investmentProjectEquity/getFirstN", "investmentProjectEquityCount": "bangk/investmentProjectEquity/count", "investmentProjectEquityGetById": "bangk/investmentProjectEquity/getById", "investmentProjectEquityGetOne": "bangk/investmentProjectEquity/getOne", "investmentProjectFundSharesGetAll": "bangk/investmentProjectFundShares/getAll", "investmentProjectFundSharesGetLastN": "bangk/investmentProjectFundShares/getLastN", "investmentProjectFundSharesGetFirstN": "bangk/investmentProjectFundShares/getFirstN", "investmentProjectFundSharesCount": "bangk/investmentProjectFundShares/count", "investmentProjectFundSharesGetById": "bangk/investmentProjectFundShares/getById", "investmentProjectFundSharesGetOne": "bangk/investmentProjectFundShares/getOne", "investmentTransactionBondsGetAll": "bangk/investmentTransactionBonds/getAll", "investmentTransactionBondsGetLastN": "bangk/investmentTransactionBonds/getLastN", "investmentTransactionBondsGetFirstN": "bangk/investmentTransactionBonds/getFirstN", "investmentTransactionBondsCount": "bangk/investmentTransactionBonds/count", "investmentTransactionBondsGetById": "bangk/investmentTransactionBonds/getById", "investmentTransactionBondsGetOne": "bangk/investmentTransactionBonds/getOne", "investmentTransactionEquityGetAll": "bangk/investmentTransactionEquity/getAll", "investmentTransactionEquityGetLastN": "bangk/investmentTransactionEquity/getLastN", "investmentTransactionEquityGetFirstN": "bangk/investmentTransactionEquity/getFirstN", "investmentTransactionEquityCount": "bangk/investmentTransactionEquity/count", "investmentTransactionEquityGetById": "bangk/investmentTransactionEquity/getById", "investmentTransactionEquityGetOne": "bangk/investmentTransactionEquity/getOne", "investmentTransactionFundSharesGetAll": "bangk/investmentTransactionFundShares/getAll", "investmentTransactionFundSharesGetLastN": "bangk/investmentTransactionFundShares/getLastN", "investmentTransactionFundSharesGetFirstN": "bangk/investmentTransactionFundShares/getFirstN", "investmentTransactionFundSharesCount": "bangk/investmentTransactionFundShares/count", "investmentTransactionFundSharesGetById": "bangk/investmentTransactionFundShares/getById", "investmentTransactionFundSharesGetOne": "bangk/investmentTransactionFundShares/getOne", "missionGetAll": "bangk/mission/getAll", "missionGetLastN": "bangk/mission/getLastN", "missionGetFirstN": "bangk/mission/getFirstN", "missionCount": "bangk/mission/count", "missionGetById": "bangk/mission/getById", "missionGetOne": "bangk/mission/getOne", "newsGetAll": "bangk/news/getAll", "newsGetLastN": "bangk/news/getLastN", "newsGetFirstN": "bangk/news/getFirstN", "newsCount": "bangk/news/count", "newsGetById": "bangk/news/getById", "newsGetOne": "bangk/news/getOne", "sellOfferBondsGetAll": "bangk/sellOfferBonds/getAll", "sellOfferBondsGetLastN": "bangk/sellOfferBonds/getLastN", "sellOfferBondsGetFirstN": "bangk/sellOfferBonds/getFirstN", "sellOfferBondsCount": "bangk/sellOfferBonds/count", "sellOfferBondsGetById": "bangk/sellOfferBonds/getById", "sellOfferBondsGetOne": "bangk/sellOfferBonds/getOne", "sellOfferEquityGetAll": "bangk/sellOfferEquity/getAll", "sellOfferEquityGetLastN": "bangk/sellOfferEquity/getLastN", "sellOfferEquityGetFirstN": "bangk/sellOfferEquity/getFirstN", "sellOfferEquityCount": "bangk/sellOfferEquity/count", "sellOfferEquityGetById": "bangk/sellOfferEquity/getById", "sellOfferEquityGetOne": "bangk/sellOfferEquity/getOne", "sellOfferFundSharesGetAll": "bangk/sellOfferFundShares/getAll", "sellOfferFundSharesGetLastN": "bangk/sellOfferFundShares/getLastN", "sellOfferFundSharesGetFirstN": "bangk/sellOfferFundShares/getFirstN", "sellOfferFundSharesCount": "bangk/sellOfferFundShares/count", "sellOfferFundSharesGetById": "bangk/sellOfferFundShares/getById", "sellOfferFundSharesGetOne": "bangk/sellOfferFundShares/getOne", "serverBlacklistGetAll": "bangk/serverBlacklist/getAll", "serverBlacklistGetLastN": "bangk/serverBlacklist/getLastN", "serverBlacklistGetFirstN": "bangk/serverBlacklist/getFirstN", "serverBlacklistCount": "bangk/serverBlacklist/count", "serverBlacklistGetById": "bangk/serverBlacklist/getById", "serverBlacklistGetOne": "bangk/serverBlacklist/getOne", "supportMessagesGetAll": "bangk/supportMessages/getAll", "supportMessagesGetLastN": "bangk/supportMessages/getLastN", "supportMessagesGetFirstN": "bangk/supportMessages/getFirstN", "supportMessagesCount": "bangk/supportMessages/count", "supportMessagesGetById": "bangk/supportMessages/getById", "supportMessagesGetOne": "bangk/supportMessages/getOne", "tagGetAll": "bangk/tag/getAll", "tagGetLastN": "bangk/tag/getLastN", "tagGetFirstN": "bangk/tag/getFirstN", "tagCount": "bangk/tag/count", "tagGetById": "bangk/tag/getById", "tagGetOne": "bangk/tag/getOne", "trackingDataEventsGetAll": "bangk/trackingDataEvents/getAll", "trackingDataEventsGetLastN": "bangk/trackingDataEvents/getLastN", "trackingDataEventsGetFirstN": "bangk/trackingDataEvents/getFirstN", "trackingDataEventsCount": "bangk/trackingDataEvents/count", "trackingDataEventsGetById": "bangk/trackingDataEvents/getById", "trackingDataEventsGetOne": "bangk/trackingDataEvents/getOne", "trackingDataSessionGetAll": "bangk/trackingDataSession/getAll", "trackingDataSessionGetLastN": "bangk/trackingDataSession/getLastN", "trackingDataSessionGetFirstN": "bangk/trackingDataSession/getFirstN", "trackingDataSessionCount": "bangk/trackingDataSession/count", "trackingDataSessionGetById": "bangk/trackingDataSession/getById", "trackingDataSessionGetOne": "bangk/trackingDataSession/getOne", "unexpectedErrorGetAll": "bangk/unexpectedError/getAll", "unexpectedErrorGetLastN": "bangk/unexpectedError/getLastN", "unexpectedErrorGetFirstN": "bangk/unexpectedError/getFirstN", "unexpectedErrorCount": "bangk/unexpectedError/count", "unexpectedErrorGetById": "bangk/unexpectedError/getById", "unexpectedErrorGetOne": "bangk/unexpectedError/getOne", "userGetAll": "bangk/user/getAll", "userGetLastN": "bangk/user/getLastN", "userGetFirstN": "bangk/user/getFirstN", "userCount": "bangk/user/count", "userGetById": "bangk/user/getById", "userGetOne": "bangk/user/getOne", "utmCampaignGetAll": "bangk/utmCampaign/getAll", "utmCampaignGetLastN": "bangk/utmCampaign/getLastN", "utmCampaignGetFirstN": "bangk/utmCampaign/getFirstN", "utmCampaignCount": "bangk/utmCampaign/count", "utmCampaignGetById": "bangk/utmCampaign/getById", "utmCampaignGetOne": "bangk/utmCampaign/getOne", "vestingConfigGetAll": "bangk/vestingConfig/getAll", "vestingConfigGetLastN": "bangk/vestingConfig/getLastN", "vestingConfigGetFirstN": "bangk/vestingConfig/getFirstN", "vestingConfigCount": "bangk/vestingConfig/count", "vestingConfigGetById": "bangk/vestingConfig/getById", "vestingConfigGetOne": "bangk/vestingConfig/getOne", "walletGetAll": "bangk/wallet/getAll", "walletGetLastN": "bangk/wallet/getLastN", "walletGetFirstN": "bangk/wallet/getFirstN", "walletCount": "bangk/wallet/count", "walletGetById": "bangk/wallet/getById", "walletGetOne": "bangk/wallet/getOne", "walletTransferTransactionGetAll": "bangk/walletTransferTransaction/getAll", "walletTransferTransactionGetLastN": "bangk/walletTransferTransaction/getLastN", "walletTransferTransactionGetFirstN": "bangk/walletTransferTransaction/getFirstN", "walletTransferTransactionCount": "bangk/walletTransferTransaction/count", "walletTransferTransactionGetById": "bangk/walletTransferTransaction/getById", "walletTransferTransactionGetOne": "bangk/walletTransferTransaction/getOne" }, "dbWrite": { "icoBonusCodeCreate": "bangk/icoBonusCode/create", "icoBonusCodeUpdate": "bangk/icoBonusCode/update", "icoBonusCodeUpdateMany": "bangk/icoBonusCode/updateMany", "icoBonusCodeUpsert": "bangk/icoBonusCode/upsert", "icoBonusCodeUpdateWithFilter": "bangk/icoBonusCode/updateWithFilter", "icoBonusCodeDelete": "bangk/icoBonusCode/delete", "icoBonusCodeDeleteWithFilter": "bangk/icoBonusCode/deleteWithFilter", "icoWalletTransactionToValidateManuallyCreate": "bangk/icoWalletTransactionToValidateManually/create", "investmentProjectBondsUpdate": "bangk/investmentProjectBonds/update", "investmentProjectBondsUpdateMany": "bangk/investmentProjectBonds/updateMany", "investmentProjectBondsUpsert": "bangk/investmentProjectBonds/upsert", "investmentProjectBondsUpdateWithFilter": "bangk/investmentProjectBonds/updateWithFilter", "investmentProjectEquityUpdate": "bangk/investmentProjectEquity/update", "investmentProjectEquityUpdateMany": "bangk/investmentProjectEquity/updateMany", "investmentProjectEquityUpsert": "bangk/investmentProjectEquity/upsert", "investmentProjectEquityUpdateWithFilter": "bangk/investmentProjectEquity/updateWithFilter", "investmentProjectFundSharesUpdate": "bangk/investmentProjectFundShares/update", "investmentProjectFundSharesUpdateMany": "bangk/investmentProjectFundShares/updateMany", "investmentProjectFundSharesUpsert": "bangk/investmentProjectFundShares/upsert", "investmentProjectFundSharesUpdateWithFilter": "bangk/investmentProjectFundShares/updateWithFilter", "userUpdate": "bangk/user/update", "userUpdateMany": "bangk/user/updateMany", "userUpsert": "bangk/user/upsert", "userUpdateWithFilter": "bangk/user/updateWithFilter", "utmCampaignCreate": "bangk/utmCampaign/create", "utmCampaignUpdate": "bangk/utmCampaign/update", "utmCampaignUpdateMany": "bangk/utmCampaign/updateMany", "utmCampaignUpsert": "bangk/utmCampaign/upsert", "utmCampaignUpdateWithFilter": "bangk/utmCampaign/updateWithFilter", "utmCampaignDelete": "bangk/utmCampaign/delete", "utmCampaignDeleteWithFilter": "bangk/utmCampaign/deleteWithFilter" } }

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