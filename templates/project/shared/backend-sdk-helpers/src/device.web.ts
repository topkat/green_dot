/* eslint-disable no-console */

import { generateObjectId } from 'topkat-utils'
import { get$ } from './init'


export type Device = {
  'user'?: string
  'deviceName': string
  'deviceType': 'desktop' | 'mobile' | 'tablet' | 'unknown'
  'os'?: 'ios' | 'macos' | 'linux' | 'windows' | 'android' | 'other'
  'browser'?: 'firefox' | 'chrome' | 'safari' | 'other' | 'opera' | 'edge' | 'internetExplorer'
  'pixelHeight'?: number
  'pixelWidth'?: number
  'language'?: string
  'deviceInfos'?: {}
  '_id': string
}

let deviceId = generateObjectId()
let retryTimeout


if (getCookieValue('deviceId')) {
  deviceId = getCookieValue('deviceId')
}

const cookieConfig = {
  secure: process.env.NODE_ENV === 'production' ? 'Secure; ' : '',
  sameSite: process.env.NODE_ENV === 'production' ? 'SameSite=None;' : '',
  domain: process.env.NODE_ENV === 'production' ? 'domain=.bangk.app; ' : '',
  path: 'Path=/'
}

document.cookie = `deviceId=${deviceId}; ` + cookieConfig.domain + cookieConfig.secure + cookieConfig.sameSite + cookieConfig.path

registerDeviceAsyncAndRetry()

const infosFromNavigator = ['appCodeName', 'oscpu', 'language', 'languages', 'product', 'vendor', 'productSub'] as const

export function getDeviceInfos(): Device {
  const infoFromNavigator = {}
  for (const key of infosFromNavigator) {
    infoFromNavigator[key] = navigator[key]
  }
  return {
    _id: deviceId,
    deviceName: navigator.userAgent,
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    language: navigator.language || navigator.languages[0],
    os: detectOS(),
    pixelHeight: window.innerHeight,
    pixelWidth: window.innerWidth,
    deviceInfos: {
      ...infoFromNavigator,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    }
  }
}

function detectDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/mobile|android|iphone|ipad|ipod|blackberry|mini|windows\sce|palm/i.test(userAgent)) {
    if (/tablet|ipad/i.test(userAgent)) return 'tablet'
    else return 'mobile'
  } else return 'desktop'
}

function detectBrowser(): Device['browser'] {
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.indexOf('chrome') > -1) {
    if (userAgent.indexOf('edg') > -1) return 'edge'
    else return 'chrome'
  } else if (userAgent.indexOf('safari') > -1) {
    if (userAgent.indexOf('opr') > -1) return 'opera'
    else return 'safari'
  } else if (userAgent.indexOf('firefox') > -1) return 'firefox'
  else if (userAgent.indexOf('msie') > -1 || userAgent.indexOf('trident') > -1) {
    return 'internetExplorer'
  } else return 'other'
}

function detectOS(): Device['os'] {
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.indexOf('win') > -1) {
    return 'windows'
  } else if (userAgent.indexOf('mac') > -1) {
    return 'macos'
  } else if (userAgent.indexOf('linux') > -1) {
    return 'linux'
  } else if (userAgent.indexOf('android') > -1) {
    return 'android'
  } else if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1 || userAgent.indexOf('ipod') > -1) return 'ios'
  else return 'other'
}


/** Allow a safe way to register device only when user is connected and avoid triggering userDoNotHaveThePermission error */
async function registerDeviceAsyncAndRetry() {
  clearTimeout(retryTimeout)
  retryTimeout = setTimeout(async () => {
    if (!deviceId) registerDeviceAsyncAndRetry()
    else {
      try {
        // in a try catch because can lead to cyclic errors
        await get$().registerUserDevice(getDeviceInfos())
      } catch (err) {
        err.isHandled = true
        console.error(err) // do not use handleError because handle error uses getDeviceId
      }
    }
  }, 5000) // <= no need to be real time, defer for perfs reasons since here in time is probably the app start
}





function getCookieValue(name: string) {
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=')
    if (cookieName === name) return cookieValue
  }
  return null
}