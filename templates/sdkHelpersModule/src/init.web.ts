/* eslint-disable no-console */

import { trackerEvent, getEventCache } from './tracker.js'
import { urlPathJoin } from 'topkat-utils'
import { get$ } from './init'
import './device.web'


//  ══╦══ ╔══╗ ╔══╗ ╔══╗ ╦ ╔  ╔══╗ ╔══╗
//    ║   ╠═╦╝ ╠══╣ ║    ╠═╩╗ ╠═   ╠═╦╝
//    ╩   ╩ ╚  ╩  ╩ ╚══╝ ╩  ╚ ╚══╝ ╩ ╚



// TODO Generize??
// REF => https://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
function removeParam(paramName) {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.delete(paramName)
  if (history.replaceState) {
    const searchString = searchParams.toString().length > 0 ? '?' + searchParams.toString() : ''
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + searchString + window.location.hash
    history.replaceState(null, '', newUrl)
  }
}


//  ╔═══ ╔══╗ ╔═══ ╔═══ ═╦═ ╔══╗ ╦╗ ╔   ╔═══ ══╦══ ╔══╗ ╔══╗ ══╦══
//  ╚══╗ ╠═   ╚══╗ ╚══╗  ║  ║  ║ ║╚╗║   ╚══╗   ║   ╠══╣ ╠═╦╝   ║
//  ═══╝ ╚══╝ ═══╝ ═══╝ ═╩═ ╚══╝ ╩ ╚╩   ═══╝   ╩   ╩  ╩ ╩ ╚    ╩
/** Record session start event and provide some session performance data */
window.addEventListener('load', () => {

  const [entry] = performance.getEntriesByType('navigation') as [PerformanceNavigationTiming]

  trackerEvent('sessionStart', { // must be the first event fired
    screen: window.location.pathname,
    timeZone: new Date().getTimezoneOffset(),
    utmCampaignId: window.location?.search?.split('u=')?.[1]?.split('&')?.[0],
    domInteractive: entry?.domInteractive,
    pageLoad: entry?.domContentLoadedEventEnd || window.performance?.timing?.domContentLoadedEventEnd - window.performance?.timing?.navigationStart,
  })
  removeParam('u')
})

export function initTrackerListeners({ isDev = false }) {

  //  ╔══╗ ╦    ═╦═ ╔══╗ ╦ ╔
  //  ║    ║     ║  ║    ╠═╩╗
  //  ╚══╝ ╚══╝ ═╩═ ╚══╝ ╩  ╚
  window.addEventListener('click', e => {
    const elmId = findClosestId(e.target as HTMLElement)
    if (elmId !== 'unknown' && elmId !== 'ignore') {
      trackerEvent('click', { id: elmId })
    } // TODO track clicks on not tracked elements ? Track rage clicks
    notDefinedIdChecks() // recalculate since click may have trigger UI rerender
  })

  //  ╦╗ ╔ ╔══╗ ╦  ╦ ═╦═ ╔══╗ ╔══╗ ══╦══ ═╦═ ╔══╗ ╦╗ ╔
  //  ║╚╗║ ╠══╣ ╚╗ ║  ║  ║ ═╦ ╠══╣   ║    ║  ║  ║ ║╚╗║
  //  ╩ ╚╩ ╩  ╩  ╚═╝ ═╩═ ╚══╝ ╩  ╩   ╩   ═╩═ ╚══╝ ╩ ╚╩
  let oldNav = window.location.pathname
  // setInterval was prefered over MutationObserver or something else
  setInterval(() => {
    if (oldNav !== window.location.pathname) {
      oldNav = window.location.pathname
      const payload = {} as Record<string, any>
      if (window.location.search) payload.searchParams = window.location.search
      trackerEvent('navigate', { screen: window.location.pathname })
      notDefinedIdChecks()
    }
  }, 1000)

  //  ╔══╗ ╔══╗ ╦╗╔╦ ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ╦╗ ╔ ══╦══   ╦  ╦ ═╦═ ╔═══ ═╦═ ╔═╗  ═╦═ ╦    ═╦═ ══╦══ ╦   ╦
  //  ║    ║  ║ ║╚╝║ ╠══╝ ║  ║ ║╚╗║ ╠═   ║╚╗║   ║     ╚╗ ║  ║  ╚══╗  ║  ╠═╩╗  ║  ║     ║    ║   ╚═╦═╝
  //  ╚══╝ ╚══╝ ╩  ╩ ╩    ╚══╝ ╩ ╚╩ ╚══╝ ╩ ╚╩   ╩      ╚═╝ ═╩═ ═══╝ ═╩═ ╚══╝ ═╩═ ╚══╝ ═╩═   ╩     ╩
  const visibilityStatus = {} as Record<string, boolean>

  // We also track visibility on interactive components
  const interactiveElmIds = [] as string[]
  getAllInteractiveElements().forEach(e => {
    const isIgnored = e?.className?.includes?.('trk-ignore')
    if (!isIgnored && e.id) interactiveElmIds.push(e.id)
  })

  /** This one tracks the visibility of tracked component (id must start with 'v.') */
  function trackVisibility() {

    const allElementsWithIds = Array.from(document.querySelectorAll('[id]')) as HTMLElement[]

    for (const e of allElementsWithIds) {
      if (e.id.startsWith('v.') || interactiveElmIds?.includes(e.id)) {
        const isVisible = isElementInViewport(e)
        if (visibilityStatus[e.id] !== isVisible) {
          console.log(`isVisible`, isVisible, e.id)
          const isSet = typeof visibilityStatus[e.id] === 'boolean'
          if (isSet || isVisible) trackerEvent(isVisible ? 'componentVisible' : 'componentHidden', { componentId: e.id })
          visibilityStatus[e.id] = isVisible
        }
      }
    }
  }

  let scrollTimeout
  window.addEventListener('wheel', () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(trackVisibility, 200) // throttle for perfs
  })
  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(trackVisibility, 200) // throttle for perfs
  })

  //  ══╦══ ╔══╗ ╔═╗    ╦  ╦ ═╦═ ╔═══ ═╦═ ╔═╗  ═╦═ ╦    ═╦═ ══╦══ ╦   ╦
  //    ║   ╠══╣ ╠═╩╗   ╚╗ ║  ║  ╚══╗  ║  ╠═╩╗  ║  ║     ║    ║   ╚═╦═╝
  //    ╩   ╩  ╩ ╚══╝    ╚═╝ ═╩═ ═══╝ ═╩═ ╚══╝ ═╩═ ╚══╝ ═╩═   ╩     ╩
  /** Check whenever the app is in foreground/background */
  document.addEventListener('visibilitychange', () => {
    setTimeout(() => {
      trackerEvent(document.visibilityState === 'hidden' ? 'pageLeft' : 'pageReturn')
    }, 200) // defer so that if the tab is closed the visibility event is never fired
  })

  //  ╦╗ ╔ ╔══╗ ══╦══   ╔═╗  ╔══╗ ╔══╗ ═╦═ ╦╗ ╔ ╔══╗ ╔═╗    ═╦═ ╔═╗  ╔═══   ╔══╗ ╦  ╦ ╔══╗ ╔══╗ ╦ ╔
  //  ║╚╗║ ║  ║   ║     ║  ║ ╠═   ╠═    ║  ║╚╗║ ╠═   ║  ║    ║  ║  ║ ╚══╗   ║    ╠══╣ ╠═   ║    ╠═╩╗
  //  ╩ ╚╩ ╚══╝   ╩     ╚══╝ ╚══╝ ╩    ═╩═ ╩ ╚╩ ╚══╝ ╚══╝   ═╩═ ╚══╝ ═══╝   ╚══╝ ╩  ╩ ╚══╝ ╚══╝ ╩  ╚
  /** Only for devlopment mode, Will check whenever all interactive elements have an id field, if not it will display an error in the console and outline the component in the UI  */
  function notDefinedIdChecks() {
    if (isDev) {
      setTimeout(() => {
        getAllInteractiveElements().forEach(e => {
          const isIgnored = e?.className?.includes?.('trk-ignore')
          if (!isIgnored && !e.id) {
            console.error('Every interactive element should have an id for tracking user interactions. Please provide an id to the orange bordered element or add class trk-ignore to the element')
            console.log(e)
            e.style.border = '2px solid orange'
          }
        })
      }, 500)

    }
  }

  notDefinedIdChecks()

  //  ╔═══ ╔══╗ ╔═══ ╔═══ ═╦═ ╔══╗ ╦╗ ╔   ╔══╗ ╦╗ ╔ ╔═╗
  //  ╚══╗ ╠═   ╚══╗ ╚══╗  ║  ║  ║ ║╚╗║   ╠═   ║╚╗║ ║  ║
  //  ═══╝ ╚══╝ ═══╝ ═══╝ ═╩═ ╚══╝ ╩ ╚╩   ╚══╝ ╩ ╚╩ ╚══╝
  window.addEventListener('beforeunload', () => {
    // Get if possible the page unload event, mostly relevant in browser
    // THIS IS NOT 100% SAFE but document.visibilityState is also tracked
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon#sending_analytics_at_the_end_of_a_session
    trackerEvent('sessionEnd')
    const url = urlPathJoin(get$().getServerUrl(), '/data-tracking-register-event')
    const data = JSON.stringify({ params: [getEventCache()] })
    navigator.sendBeacon(url, data)
  })
}


//  ╦  ╦ ╔══╗ ╦    ╔══╗ ╔══╗ ╔══╗ ╔═══
//  ╠══╣ ╠═   ║    ╠══╝ ╠═   ╠═╦╝ ╚══╗
//  ╩  ╩ ╚══╝ ╚══╝ ╩    ╚══╝ ╩ ╚  ═══╝
function findClosestId(e: HTMLElement) {
  if (e?.className?.includes?.('trk-ignore')) return 'ignore'
  else return e ? e.id || e.parentElement?.id || e.parentElement?.parentElement?.id || e.parentElement?.parentElement?.parentElement?.id || 'unknown' : 'unknown'
}

function isElementInViewport(e: HTMLElement) {
  const rect = e.getBoundingClientRect()
  const [wHeight, wWidth] = [window.innerHeight || document.documentElement.clientHeight, window.innerWidth || document.documentElement.clientWidth]
  return (
    rect.top >= 0 && rect.left >= 0
    && (
      (rect.top < (wHeight - wHeight * 0.33) && rect.left < (wWidth - wWidth * 0.33))
      || (rect.bottom < wHeight && rect.right < wWidth)
    )
  )
}

function getAllInteractiveElements() {
  return [
    ...Array.from(document.querySelectorAll('[onclick]')),
    ...Array.from(document.querySelectorAll('[onmousedown]')),
    ...Array.from(document.querySelectorAll('form > button')),
    ...Array.from(document.getElementsByTagName('a')),
  ] as HTMLElement[]
}

export { getDeviceInfos } from './device.web'