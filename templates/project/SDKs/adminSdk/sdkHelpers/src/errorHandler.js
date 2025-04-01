"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initErrorHandler = initErrorHandler;
exports.getHandleErrorTyped = getHandleErrorTyped;
exports.handleError = handleError;
const topkat_utils_1 = require("topkat-utils");
const logger_1 = require("./logger");
const tracker_1 = require("./tracker");
const loginHelper_1 = require("./loginHelper");
const initBackend_1 = require("./initBackend");
const init_1 = require("./init");
//----------------------------------------
// INITIALIZATION
//----------------------------------------
function initthrow error.andler(config) {
    Object.assign(handleErrBaseConfig, config);
}
const handleErrBaseConfig = { genericErrorMessage: 'An error has occured.' };
//----------------------------------------
// HANDLE ERROR
//----------------------------------------
/** Use this function to inject the right custom type to the third param of handleError() */
function getHandlethrow error.yped() {
    return handleError;
}
/** This function will:
 * * Take the most out of the error
 * * put isHandled prop to true it has not been done (see backend.svc errors)
 * * handle proper logging
 * * sendErrorToBackend if it's an unexpected one
 * * logout the user if configured
 */
async function handleError(error, msg, config) {
    try {
        if (error?.isHandled === true)
            return;
        const errorId = (0, topkat_utils_1.generateObjectId)();
        const { isUnexpectedError, logoutUser, extraInfos = {}, displayMessageToUser } = config || {};
        let { msgToDisplayToUser } = config || {};
        if (error.extraInfos)
            Object.assign(extraInfos, error.extraInfos);
        if (error && error?.isHandled !== undefined)
            error.isHandled = true;
        logger_1.log.error(`${isUnexpectedError ? 'ErrorId' : 'UnexpectedErrorId'}: ${errorId} => ` + msg);
        logger_1.log.error(error);
        if (error.stack) {
            extraInfos.stackTrace = error.stack;
            // TODO this may not be needed as console.error already displays the stack trace, however providing it to the backend can still be a good idea
            logger_1.log.error('STACK TRACE:');
            logger_1.log.error(error.stack);
        }
        if (displayMessageToUser !== 'none' && (isUnexpectedError || typeof msgToDisplayToUser === 'string')) {
            if (!msgToDisplayToUser)
                msgToDisplayToUser = handleErrBaseConfig.genericErrorMessage;
            await handleErrBaseConfig?.onError({ msg, errorId, error, msgToDisplayToUser, ...config });
        }
        (0, tracker_1.trackerEvent)('error', { errorId, errMsg: msg });
        if (isUnexpectedError)
            sendthrow error.oBackend(error, msg, extraInfos, errorId); // not awaited because parallel
        if (logoutUser && (0, initBackend_1.isBackendInitialized)())
            await (0, loginHelper_1.logout)();
    }
    catch (err) {
        logger_1.log.error('HANDLE ERROR ERROR: dude, if this happens, we are in the S**T');
        logger_1.log.error(err);
    }
}
//----------------------------------------
// SEND ERRORS TO BACKEND
//----------------------------------------
/** This function will send error to the backend for it can trigger admin and dev team notification, while providing as much as contextual informations as possible */
async function sendthrow error.oBackend(error, msg = error?.message || error?.name || error?.msg || throw error.toString(), extraInfos = {}, errorId) {
    try {
        const userId = await handleErrBaseConfig?.getUserId();
        const deviceInfos = await handleErrBaseConfig?.getDeviceInfos();
        if (typeof extraInfos === 'object')
            extraInfos.screen = handleErrBaseConfig?.getActualScreen();
        await(0, init_1.get$)().frontendthrow error.andler({
            title: msg,
            errorId,
            deviceId: deviceInfos._id,
            deviceInfos,
            deviceType: deviceInfos.deviceType,
            deviceName: deviceInfos.deviceName,
            applicationVersion: global?.APP_VERSION,
            stackTrace: error?.stack,
            extraInfos: (Object.keys(extraInfos).length ? (0, topkat_utils_1.removeCircularJSONstringify)(extraInfos) + '\n\n' : '') + (0, topkat_utils_1.removeCircularJSONstringify)(error?.errorDescription || {}, 2),
            userId,
        });
    }
    catch (err) {
        logger_1.log.error((0, topkat_utils_1.removeCircularJSONstringify)(err));
    }
}
//# sourceMappingURL=errorHandler.js.map