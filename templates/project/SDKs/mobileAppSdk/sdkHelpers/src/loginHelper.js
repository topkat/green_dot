"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = logout;
exports.setAccessToken = setAccessToken;
exports.ensureAccessToken = ensureAccessToken;
const initBackend_1 = require("./initBackend");
const init_1 = require("./init");
const topkat_utils_1 = require("topkat-utils");
const errorHandler_1 = require("./errorHandler");
const global_shared_1 = require("../../shared/constants");
const isPageVisible = true;
let isSessionInitialized = false;
async function logout() {
    try {
        try {
            (0, initBackend_1.getBackendConfig)().localStorageRemove('isConnected');
            await (0, init_1.get$)().logout();
            // This will fire a storage event for other tabs to detect the user update
            (0, initBackend_1.getBackendConfig)().localStorageSet('authUpdate', Date.now().toString());
        }
        catch (err) {
            if (err.code !== 'ERR_NETWORK')
                err.isHandled = true;
        }
        lastRefreshTokenDate = undefined;
        (0, init_1.get$)().setAuthorization(null);
        const queryClient = (0, initBackend_1.getBackendConfig)().getQueryClient?.();
        queryClient.clear();
        queryClient.resetQueries();
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        err.isHandled = true;
    }
    await (0, initBackend_1.getBackendConfig)().onLogout?.();
}
function setAccessToken(accessToken) {
    if (accessToken) {
        (0, initBackend_1.getBackendConfig)().localStorageSet('isConnected', 'true');
        (0, initBackend_1.getBackendConfig)().localStorageSet('accessToken', accessToken);
    }
}
let lastRefreshTokenDate;
/** This will try to connect without login if refresh token is still valid. If not, this will logout the user */
async function ensureAccessToken() {
    let success = typeof lastRefreshTokenDate === 'number'; // in case it's called 2 times
    if (!success) {
        clearTimeout(getNewTokenTo);
        getNewTokenInterval();
        try {
            success = await getNewToken();
            if (success) {
                (0, initBackend_1.getBackendConfig)().localStorageSet('isConnected', 'true');
            }
            else {
                if ((0, initBackend_1.getBackendConfig)().localStorageGet('accessToken'))
                    (0, topkat_utils_1.failSafe)(async () => await logout());
                (0, initBackend_1.getBackendConfig)().localStorageRemove('isConnected');
            }
        }
        catch (err) {
            success = false;
            const logout = !window.location.pathname.includes('login') && !window.location.pathname.includes('register');
            (0, errorHandler_1.handleError)(err, 'errorWrongToken', {
                msgToDisplayToUser: (0, initBackend_1.getBackendConfig)().wrongTokenErrorMessage,
                userActionChoice: 'contactSupport',
                logoutUser: logout,
            });
        }
    }
    return { success };
}
//----------------------------------------
// REFRESH TOKEN INTERVAL
// auto refresh the token once the refresh
// token has been set
//----------------------------------------
let getNewTokenTo;
const refreshTokenIntervalMs = global_shared_1.refreshTokenExpirationMinutes * 60 * 1000 * 0.75;
/** This will get a new token periodically */
function getNewTokenInterval() {
    clearTimeout(getNewTokenTo);
    getNewTokenTo = setTimeout(async () => {
        if ((0, initBackend_1.isBackendInitialized)())
            getNewToken(); // includes setRefreshToken that calls again refreshTokenInterval
        else
            getNewTokenInterval();
    }, refreshTokenIntervalMs);
}
getNewTokenInterval();
let isRefreshing = false;
/** This will get a new token  */
async function getNewToken() {
    let success = false;
    if (!isPageVisible) { // we don't refresh the token in this case so it naturraly will disconnect in 15 minutes
        getNewTokenInterval();
        return true;
    }
    else if (isRefreshing) { // must wait first time token
        // there may be concurent api calls on app load, in this case, we let a little time pass before we retry
        // this way we ensure token is asked and if there is an error that the error is thrown properly in any case
        await (0, topkat_utils_1.timeout)(150);
        return await getNewToken();
    }
    else {
        isRefreshing = true;
        try {
            const deviceId = await (0, initBackend_1.getBackendConfig)()?.getDeviceId();
            if (!deviceId)
                throw new Error('noDeviceId');
            const isConnectedStr = (0, initBackend_1.getBackendConfig)().localStorageGet('isConnected');
            if (!isConnectedStr)
                return false;
            const { accessToken } = await (0, init_1.get$)().getNewToken({ deviceId });
            setAccessToken(accessToken);
            getNewTokenInterval();
            if (!isSessionInitialized) {
                await (0, initBackend_1.getBackendConfig)()?.onBackendInitialized?.();
                isSessionInitialized = true;
            }
            success = true;
            lastRefreshTokenDate = Date.now();
        }
        catch (err) {
            (0, errorHandler_1.handleError)(err, 'refreshTokenError', {
                isUnexpectedError: false,
                msgToDisplayToUser: (0, initBackend_1.getBackendConfig)().refreshTokenErrorMessage,
                logoutUser: false,
                userActionChoice: 'contactSupport',
            });
        }
        finally {
            isRefreshing = false;
        }
        return success;
    }
}
//# sourceMappingURL=loginHelper.js.map