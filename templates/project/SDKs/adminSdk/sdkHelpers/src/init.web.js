"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceInfos = void 0;
exports.initTrackerListeners = initTrackerListeners;
const tracker_js_1 = require("./tracker.js");
const topkat_utils_1 = require("topkat-utils");
const init_1 = require("./init");
require("./device.web");
//  ══╦══ ╔══╗ ╔══╗ ╔══╗ ╦ ╔  ╔══╗ ╔══╗
//    ║   ╠═╦╝ ╠══╣ ║    ╠═╩╗ ╠═   ╠═╦╝
//    ╩   ╩ ╚  ╩  ╩ ╚══╝ ╩  ╚ ╚══╝ ╩ ╚
// TODO Generize??
// REF => https://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
function removeParam(paramName) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(paramName);
    if (history.replaceState) {
        const searchString = searchParams.toString().length > 0 ? '?' + searchParams.toString() : '';
        const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + searchString + window.location.hash;
        history.replaceState(null, '', newUrl);
    }
}
//  ╔═══ ╔══╗ ╔═══ ╔═══ ═╦═ ╔══╗ ╦╗ ╔   ╔═══ ══╦══ ╔══╗ ╔══╗ ══╦══
//  ╚══╗ ╠═   ╚══╗ ╚══╗  ║  ║  ║ ║╚╗║   ╚══╗   ║   ╠══╣ ╠═╦╝   ║
//  ═══╝ ╚══╝ ═══╝ ═══╝ ═╩═ ╚══╝ ╩ ╚╩   ═══╝   ╩   ╩  ╩ ╩ ╚    ╩
/** Record session start event and provide some session performance data */
window.addEventListener('load', () => {
    const [entry] = performance.getEntriesByType('navigation');
    (0, tracker_js_1.trackerEvent)('sessionStart', {
        screen: window.location.pathname,
        timeZone: new Date().getTimezoneOffset(),
        utmCampaignId: window.location?.search?.split('u=')?.[1]?.split('&')?.[0],
        domInteractive: entry?.domInteractive,
        pageLoad: entry?.domContentLoadedEventEnd || window.performance?.timing?.domContentLoadedEventEnd - window.performance?.timing?.navigationStart,
    });
    removeParam('u');
});
function initTrackerListeners({ isDev = false }) {
    //  ╔══╗ ╦    ═╦═ ╔══╗ ╦ ╔
    //  ║    ║     ║  ║    ╠═╩╗
    //  ╚══╝ ╚══╝ ═╩═ ╚══╝ ╩  ╚
    window.addEventListener('click', e => {
        const elmId = findClosestId(e.target);
        if (elmId !== 'unknown' && elmId !== 'ignore') {
            (0, tracker_js_1.trackerEvent)('click', { id: elmId });
        } // TODO track clicks on not tracked elements ? Track rage clicks
        notDefinedIdChecks(); // recalculate since click may have trigger UI rerender
    });
    //  ╦╗ ╔ ╔══╗ ╦  ╦ ═╦═ ╔══╗ ╔══╗ ══╦══ ═╦═ ╔══╗ ╦╗ ╔
    //  ║╚╗║ ╠══╣ ╚╗ ║  ║  ║ ═╦ ╠══╣   ║    ║  ║  ║ ║╚╗║
    //  ╩ ╚╩ ╩  ╩  ╚═╝ ═╩═ ╚══╝ ╩  ╩   ╩   ═╩═ ╚══╝ ╩ ╚╩
    let oldNav = window.location.pathname;
    // setInterval was prefered over MutationObserver or something else
    setInterval(() => {
        if (oldNav !== window.location.pathname) {
            oldNav = window.location.pathname;
            const payload = {};
            if (window.location.search)
                payload.searchParams = window.location.search;
            (0, tracker_js_1.trackerEvent)('navigate', { screen: window.location.pathname });
            notDefinedIdChecks();
        }
    }, 1000);
    //  ╔══╗ ╔══╗ ╦╗╔╦ ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╦╗ ╔ ══╦══   ╦  ╦ ═╦═ ╔═══ ═╦═ ╔═╗  ═╦═ ╦    ═╦═ ══╦══ ╦   ╦
    //  ║    ║  ║ ║╚╝║ ╠══╝ ║  ║ ║╚╗║ ╠═   ║╚╗║   ║     ╚╗ ║  ║  ╚══╗  ║  ╠═╩╗  ║  ║     ║    ║   ╚═╦═╝
    //  ╚══╝ ╚══╝ ╩  ╩ ╩    ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚╩   ╩      ╚═╝ ═╩═ ═══╝ ═╩═ ╚══╝ ═╩═ ╚══╝ ═╩═   ╩     ╩
    const visibilityStatus = {};
    // We also track visibility on interactive components
    const interactiveElmIds = [];
    getAllInteractiveElements().forEach((e) => {
        const isIgnored = e?.className?.includes?.('trk-ignore');
        if (!isIgnored && e.id)
            interactiveElmIds.push(e.id);
    });
    /** This one tracks the visibility of tracked component (id must start with 'v.') */
    function trackVisibility() {
        const allElementsWithIds = Array.from(document.querySelectorAll('[id]'));
        for (const e of allElementsWithIds) {
            if (e.id.startsWith('v.') || interactiveElmIds?.includes(e.id)) {
                const isVisible = isElementInViewport(e);
                if (visibilityStatus[e.id] !== isVisible) {
                    console.log(`isVisible`, isVisible, e.id);
                    const isSet = typeof visibilityStatus[e.id] === 'boolean';
                    if (isSet || isVisible)
                        (0, tracker_js_1.trackerEvent)(isVisible ? 'componentVisible' : 'componentHidden', { componentId: e.id });
                    visibilityStatus[e.id] = isVisible;
                }
            }
        }
    }
    let scrollTimeout;
    window.addEventListener('wheel', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackVisibility, 200); // throttle for perfs
    });
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(trackVisibility, 200); // throttle for perfs
    });
    //  ══╦══ ╔══╗ ╔═╗    ╦  ╦ ═╦═ ╔═══ ═╦═ ╔═╗  ═╦═ ╦    ═╦═ ══╦══ ╦   ╦
    //    ║   ╠══╣ ╠═╩╗   ╚╗ ║  ║  ╚══╗  ║  ╠═╩╗  ║  ║     ║    ║   ╚═╦═╝
    //    ╩   ╩  ╩ ╚══╝    ╚═╝ ═╩═ ═══╝ ═╩═ ╚══╝ ═╩═ ╚══╝ ═╩═   ╩     ╩
    /** Check whenever the app is in foreground/background */
    document.addEventListener('visibilitychange', () => {
        setTimeout(() => {
            (0, tracker_js_1.trackerEvent)(document.visibilityState === 'hidden' ? 'pageLeft' : 'pageReturn');
        }, 200); // defer so that if the tab is closed the visibility event is never fired
    });
    //  ╦╗ ╔ ╔══╗ ══╦══   ╔═╗  ╔══╗ ╔══╗ ═╦═ ╦╗ ╔ ╔══╗ ╔═╗    ═╦═ ╔═╗  ╔═══   ╔══╗ ╦  ╦ ╔══╗ ╔══╗ ╦ ╔
    //  ║╚╗║ ║  ║   ║     ║  ║ ╠═   ╠═    ║  ║╚╗║ ╠═   ║  ║    ║  ║  ║ ╚══╗   ║    ╠══╣ ╠═   ║    ╠═╩╗
    //  ╩ ╚╩ ╚══╝   ╩     ╚══╝ ╚══╝ ╩    ═╩═ ╩ ╚╩ ╚══╝ ╚══╝   ═╩═ ╚══╝ ═══╝   ╚══╝ ╩  ╩ ╚══╝ ╚══╝ ╩  ╚
    /** Only for devlopment mode, Will check whenever all interactive elements have an id field, if not it will display an error in the console and outline the component in the UI  */
    function notDefinedIdChecks() {
        if (isDev) {
            setTimeout(() => {
                getAllInteractiveElements().forEach((e) => {
                    const isIgnored = e?.className?.includes?.('trk-ignore');
                    if (!isIgnored && !e.id) {
                        console.error('Every interactive element should have an id for tracking user interactions. Please provide an id to the orange bordered element or add class trk-ignore to the element');
                        console.log(e);
                        e.style.border = '2px solid orange';
                    }
                });
            }, 500);
        }
    }
    notDefinedIdChecks();
    //  ╔═══ ╔══╗ ╔═══ ╔═══ ═╦═ ╔══╗ ╦╗ ╔   ╔══╗ ╦╗ ╔ ╔═╗
    //  ╚══╗ ╠═   ╚══╗ ╚══╗  ║  ║  ║ ║╚╗║   ╠═   ║╚╗║ ║  ║
    //  ═══╝ ╚══╝ ═══╝ ═══╝ ═╩═ ╚══╝ ╩ ╚╩   ╚══╝ ╩ ╚╩ ╚══╝
    window.addEventListener('beforeunload', () => {
        // Get if possible the page unload event, mostly relevant in browser
        // THIS IS NOT 100% SAFE but document.visibilityState is also tracked
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon#sending_analytics_at_the_end_of_a_session
        (0, tracker_js_1.trackerEvent)('sessionEnd');
        const url = (0, topkat_utils_1.urlPathJoin)((0, init_1.get$)().getServerUrl(), '/data-tracking-register-event');
        const data = JSON.stringify({ params: [(0, tracker_js_1.getEventCache)()] });
        navigator.sendBeacon(url, data);
    });
}
//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝
function findClosestId(e) {
    if (e?.className?.includes?.('trk-ignore'))
        return 'ignore';
    else
        return e ? e.id || e.parentElement?.id || e.parentElement?.parentElement?.id || e.parentElement?.parentElement?.parentElement?.id || 'unknown' : 'unknown';
}
function isElementInViewport(e) {
    const rect = e.getBoundingClientRect();
    const [wHeight, wWidth] = [window.innerHeight || document.documentElement.clientHeight, window.innerWidth || document.documentElement.clientWidth];
    return (rect.top >= 0 && rect.left >= 0
        && ((rect.top < (wHeight - wHeight * 0.33) && rect.left < (wWidth - wWidth * 0.33))
            || (rect.bottom < wHeight && rect.right < wWidth)));
}
function getAllInteractiveElements() {
    return [
        ...Array.from(document.querySelectorAll('[onclick]')),
        ...Array.from(document.querySelectorAll('[onmousedown]')),
        ...Array.from(document.querySelectorAll('form > button')),
        ...Array.from(document.getElementsByTagName('a')),
    ];
}
var device_web_1 = require("./device.web");
Object.defineProperty(exports, "getDeviceInfos", { enumerable: true, get: function () { return device_web_1.getDeviceInfos; } });
//# sourceMappingURL=init.web.js.map