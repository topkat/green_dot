"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBackend = initBackend;
exports.isBackendInitialized = isBackendInitialized;
exports.getBackendConfig = getBackendConfig;
const topkat_utils_1 = require("topkat-utils");
const init_1 = require("./init");
(0, topkat_utils_1.registerConfig)({ terminal: { noColor: true } });
let isInitialized = false;
const notImplementedErrMsg = (fnName) => { throw new Error(`${fnName}() is not set in backend. Check backend has been initialized correctly`); };
const fakeLs = {};
const cacheLocalStorage = {
    get: key => fakeLs[key],
    set: (key, val) => fakeLs[key] = val.toString(),
    remove: key => delete fakeLs[key],
};
const backendConfig = {
    serverUrls: { default: 'backend', backend: 'http://localhost:9086' },
    projectName: 'undefined',
    getDeviceId: () => notImplementedErrMsg('getDeviceId'),
    getQueryClient: () => notImplementedErrMsg('getQueryClient'),
    localStorageSet: cacheLocalStorage.set,
    localStorageGet: cacheLocalStorage.get,
    localStorageRemove: cacheLocalStorage.remove,
    onErrorCallback: error => { throw error; },
    refreshTokenExpirationMinutes: 15,
    refreshTokenErrorMessage: 'Wrong refresh token',
    wrongTokenErrorMessage: 'Wrong Token',
};
//----------------------------------------
// INITIALIZATION
//----------------------------------------
function initBackend(config) {
    Object.assign(backendConfig, config);
    const apiUrl = backendConfig?.serverUrls[backendConfig.serverUrls?.default];
    if (!apiUrl)
        topkat_utils_1.C.error(false, 'API URL NOT SET FOR BACKEND', JSON.stringify(backendConfig, null, 2));
    topkat_utils_1.C.info(`apiUrl ` + JSON.stringify(apiUrl));
    (0, init_1.get$)().init(backendConfig);
    isInitialized = true;
}
function isBackendInitialized() {
    return isInitialized;
}
function getBackendConfig() {
    return backendConfig;
}
//# sourceMappingURL=initBackend.js.map