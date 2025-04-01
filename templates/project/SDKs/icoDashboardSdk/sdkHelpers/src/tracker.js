"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventCache = exports.getActualScreen = exports.initTrackerData = void 0;
exports.trackerEvent = trackerEvent;
exports.sendDataToServer = sendDataToServer;
const init_1 = require("./init");
const topkat_utils_1 = require("topkat-utils");
let eventCache = [];
const screen = 'home';
const session = (0, topkat_utils_1.generateObjectId)();
let sessionStarted = false;
const trackerConfig = {
    projectName: 'undefined',
    getDeviceId() { console.error('NOT IMPLEMENTED, please use `initTrackerData(...) to init the tracker`'); return ''; },
};
/** Initialize tracker with passing mandatory configs, this should be called AFTER BACKEND INIT */
const initTrackerData = (config) => {
    Object.assign(trackerConfig, config);
    sendDataToServer();
};
exports.initTrackerData = initTrackerData;
function trackerEvent(evtName, payload = {}) {
    if (evtName === 'sessionStart')
        sessionStarted = true;
    const errorId = payload?.errorId;
    const newEvent = {
        type: evtName,
        project: trackerConfig.projectName,
        session,
        ts: Date.now(),
        data: Object.keys(payload).length ? { ...payload, data: undefined, ...(payload.data || {}) } : undefined,
        error: errorId,
    };
    const bodyFields = ['screen', 'utmCampaignId']; // TODO this is not previsible but has been made for the code to be simple
    bodyFields.forEach(b => {
        if (payload[b])
            newEvent[b] = payload[b];
    });
    const toDeleteInPayload = ['errorId', ...bodyFields];
    toDeleteInPayload.forEach(fieldName => delete payload[fieldName]);
    if (evtName === 'sessionStart')
        eventCache.unshift(newEvent);
    else
        eventCache.push(newEvent);
}
/** Data is sent groupped and in an asynchronous way, to avoid sending too much requests and
mess with app fluidity and performances */
const timeoutBaseValue = 10000;
let nextTimeout = timeoutBaseValue;
//  ╔═══ ╔══╗ ╦╗ ╔ ╔═╗    ╔═╗  ╔══╗ ══╦══ ╔══╗   ══╦══ ╔══╗   ╔═══ ╔══╗ ╔══╗ ╦  ╦ ╔══╗ ╔══╗
//  ╚══╗ ╠═   ║╚╗║ ║  ║   ║  ║ ╠══╣   ║   ╠══╣     ║   ║  ║   ╚══╗ ╠═   ╠═╦╝ ╚╗ ║ ╠═   ╠═╦╝
//  ═══╝ ╚══╝ ╩ ╚╩ ╚══╝   ╚══╝ ╩  ╩   ╩   ╩  ╩     ╩   ╚══╝   ═══╝ ╚══╝ ╩ ╚   ╚═╝ ╚══╝ ╩ ╚
async function sendDataToServer() {
    const deviceId = await trackerConfig.getDeviceId();
    if (deviceId && sessionStarted && eventCache.length) {
        const eventsToSend = eventCache;
        eventCache = [];
        eventsToSend.forEach(e => {
            // this is the very place to define it because we are sure isInitialised
            e.device = deviceId;
            e.project = trackerConfig.projectName;
        });
        try {
            await (0, init_1.get$)().dataTrackingRegisterEvent(eventsToSend);
            nextTimeout = timeoutBaseValue; // reset
        }
        catch (err) {
            err.isHandled = true;
            eventCache.unshift(...eventsToSend);
            nextTimeout += timeoutBaseValue; // on error we add time for next try
        }
    }
    setTimeout(() => {
        sendDataToServer();
    }, nextTimeout);
}
const getActualScreen = () => screen;
exports.getActualScreen = getActualScreen;
const getEventCache = () => eventCache;
exports.getEventCache = getEventCache;
//# sourceMappingURL=tracker.js.map