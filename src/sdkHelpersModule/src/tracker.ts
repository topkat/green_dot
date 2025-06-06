/* eslint-disable no-console */

import { get$ } from './init.js'
import { generateObjectId } from 'topkat-utils'


export const specialEvents = ['navigate', 'componentVisible', 'componentHidden', 'error', 'sessionStart'] as const
export type SpecialEvents = typeof specialEvents[number]
export const standardEvent = ['press', 'click', 'sessionEnd', 'pageLeft', 'pageReturn'] as const
export type StandardEvent = typeof standardEvent[number]
export const eventNames = [...standardEvent, ...specialEvents]
export type EventNames = StandardEvent | SpecialEvents



type Event = {
  type: string
  project: string
  session: any
  ts: number
  data: Record<string, any>
  error: string
  device?: string
}

let eventCache: Event[] = []
const screen = 'home'
const session = generateObjectId()
let sessionStarted = false

//  ╔══╗ ╔══╗ ╦╗ ╔ ╔══╗ ═╦═ ╔══╗
//  ║    ║  ║ ║╚╗║ ╠═    ║  ║ ═╦
//  ╚══╝ ╚══╝ ╩ ╚╩ ╩    ═╩═ ╚══╝
type InitTrackerConfig = {
  projectName: string
  getDeviceId(): string | Promise<string>
}

const trackerConfig = {
  projectName: 'undefined',
  getDeviceId() { console.error('NOT IMPLEMENTED, please use `initTrackerData(...) to init the tracker`'); return '' },
} satisfies InitTrackerConfig

/** Initialize tracker with passing mandatory configs, this should be called AFTER BACKEND INIT */
export const initTrackerData = (config: InitTrackerConfig) => {
  Object.assign(trackerConfig, config)
  sendDataToServer()
}

//  ══╦══ ╔══╗ ╔══╗ ╔══╗ ╦ ╔  ╔══╗ ╔══╗   ╔══╗ ╦  ╦ ╔══╗ ╦╗ ╔ ══╦══
//    ║   ╠═╦╝ ╠══╣ ║    ╠═╩╗ ╠═   ╠═╦╝   ╠═   ╚╗ ║ ╠═   ║╚╗║   ║
//    ╩   ╩ ╚  ╩  ╩ ╚══╝ ╩  ╚ ╚══╝ ╩ ╚    ╚══╝  ╚═╝ ╚══╝ ╩ ╚╩   ╩
/** Send events, for navigation, please use 'navigate' event with providing a screen so that all further events will be recorded on that screen */
export function trackerEvent(evtName: 'error', payload: Record<string, any> & { errMsg: string, errorId: string })
export function trackerEvent(evtName: 'navigate', payload: Record<string, any> & { screen: string })
export function trackerEvent(evtName: 'sessionStart', payload: Record<string, any> & { utmCampaignId: string, timeZone: number, screen: string })
export function trackerEvent(evtName: 'componentVisible' | 'componentHidden', payload: Record<string, any> & { componentId: string })
export function trackerEvent(evtName: StandardEvent, payload?: Record<string, any>)
export function trackerEvent(evtName: EventNames, payload: Record<string, any> = {}) {

  if (evtName === 'sessionStart') sessionStarted = true

  const errorId = payload?.errorId

  const newEvent = {
    type: evtName,
    project: trackerConfig.projectName,
    session,
    ts: Date.now(),
    data: Object.keys(payload).length ? { ...payload, data: undefined, ...(payload.data || {}) } : undefined,
    error: errorId,
  } satisfies Event

  const bodyFields = ['screen', 'utmCampaignId'] as const // TODO this is not previsible but has been made for the code to be simple
  bodyFields.forEach(b => {
    if (payload[b]) newEvent[b] = payload[b]
  })

  const toDeleteInPayload = ['errorId', ...bodyFields] as const
  toDeleteInPayload.forEach(fieldName => delete payload[fieldName])

  if (evtName === 'sessionStart') eventCache.unshift(newEvent)
  else eventCache.push(newEvent)
}



/** Data is sent groupped and in an asynchronous way, to avoid sending too much requests and
mess with app fluidity and performances */
const timeoutBaseValue = 10000
let nextTimeout = timeoutBaseValue

//  ╔═══ ╔══╗ ╦╗ ╔ ╔═╗    ╔═╗  ╔══╗ ══╦══ ╔══╗   ══╦══ ╔══╗   ╔═══ ╔══╗ ╔══╗ ╦  ╦ ╔══╗ ╔══╗
//  ╚══╗ ╠═   ║╚╗║ ║  ║   ║  ║ ╠══╣   ║   ╠══╣     ║   ║  ║   ╚══╗ ╠═   ╠═╦╝ ╚╗ ║ ╠═   ╠═╦╝
//  ═══╝ ╚══╝ ╩ ╚╩ ╚══╝   ╚══╝ ╩  ╩   ╩   ╩  ╩     ╩   ╚══╝   ═══╝ ╚══╝ ╩ ╚   ╚═╝ ╚══╝ ╩ ╚
export async function sendDataToServer() {
  const deviceId = await trackerConfig.getDeviceId()
  if (deviceId && sessionStarted && eventCache.length) {
    const eventsToSend = eventCache
    eventCache = []
    eventsToSend.forEach(e => {
      // this is the very place to define it because we are sure isInitialised
      e.device = deviceId
      e.project = trackerConfig.projectName
    })
    try {
      await get$().dataTrackingRegisterEvent(eventsToSend)
      nextTimeout = timeoutBaseValue // reset
    } catch (err) {
      err.isHandled = true
      eventCache.unshift(...eventsToSend)
      nextTimeout += timeoutBaseValue // on error we add time for next try
    }
  }
  setTimeout(() => {
    sendDataToServer()
  }, nextTimeout)
}

export const getActualScreen = () => screen

export const getEventCache = () => eventCache