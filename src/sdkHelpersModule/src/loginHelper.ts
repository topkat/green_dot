
import { getSdkConfig, isSdkInitialized } from './initSdk.js'
import { get$ } from './init.js'
import { failSafe, timeout } from 'topkat-utils'
import { handleError } from './errorHandler.js'


const isPageVisible = true
let isSessionInitialized = false

export async function logout() {
  try {
    try {
      getSdkConfig().localStorageRemove?.('isConnected')
      await get$().logout()
      // This will fire a storage event for other tabs to detect the user update
      getSdkConfig().localStorageSet?.('authUpdate', Date.now().toString())
    } catch (err) {
      if (err.code !== 'ERR_NETWORK') err.isHandled = true
    }
    lastRefreshTokenDate = undefined
    get$().setAuthorization(null)

    const queryClient = getSdkConfig().getQueryClient?.()

    queryClient?.clear()
    queryClient?.resetQueries()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    err.isHandled = true
  }
  await getSdkConfig().onLogout?.()
}






export function setAccessToken(accessToken?: string) {
  if (accessToken) {
    getSdkConfig().localStorageSet?.('isConnected', 'true')
    getSdkConfig().localStorageSet?.('accessToken', accessToken)
  }
}






let lastRefreshTokenDate: number | undefined

/** This will try to connect without login if refresh token is still valid. If not, this will logout the user */
export async function ensureAccessToken() {
  let success = typeof lastRefreshTokenDate === 'number' // in case it's called 2 times
  if (!success) {
    clearTimeout(getNewTokenTo)
    getNewTokenInterval()
    try {
      success = await getNewToken()
      if (success) {
        getSdkConfig().localStorageSet?.('isConnected', 'true')
      } else {
        if (getSdkConfig().localStorageGet?.('accessToken')) failSafe(async () => await logout())
        getSdkConfig().localStorageRemove?.('isConnected')
      }
    } catch (err) {
      success = false
      const logout = !window.location.pathname.includes('login') && !window.location.pathname.includes('register')
      handleError(err, 'errorWrongToken', {
        msgToDisplayToUser: getSdkConfig().wrongTokenErrorMessage,
        userActionChoice: 'contactSupport',
        logoutUser: logout,
      })
    }
  }
  return { success }
}




//----------------------------------------
// REFRESH TOKEN INTERVAL
// auto refresh the token once the refresh
// token has been set
//----------------------------------------
let getNewTokenTo
/** This will get a new token periodically */
function getNewTokenInterval() {
  const tokenExirationMinutes = getSdkConfig().refreshTokenExpirationMinutes || 15
  clearTimeout(getNewTokenTo)
  getNewTokenTo = setTimeout(async () => {
    if (isSdkInitialized()) getNewToken() // includes setRefreshToken that calls again refreshTokenInterval
    else getNewTokenInterval()
  }, tokenExirationMinutes * 60 * 1000 * 0.75) // 0.75 is to refresh the token slightly before expiration
}
getNewTokenInterval()



let isRefreshing = false
/** This will get a new token  */
async function getNewToken(): Promise<boolean> {


  let success = false
  if (!isPageVisible) { // we don't refresh the token in this case so it naturraly will disconnect in 15 minutes
    getNewTokenInterval()
    return true
  } else if (isRefreshing) { // must wait first time token
    // there may be concurent api calls on app load, in this case, we let a little time pass before we retry
    // this way we ensure token is asked and if there is an error that the error is thrown properly in any case
    await timeout(150)
    return await getNewToken()
  } else {
    isRefreshing = true
    try {

      const deviceId = await getSdkConfig()?.getDeviceId()
      if (!deviceId) throw new Error('noDeviceId')

      const isConnectedStr = getSdkConfig().localStorageGet?.('isConnected')
      if (!isConnectedStr) return false

      const { accessToken } = await get$().getNewToken({ deviceId })
      setAccessToken(accessToken)
      getNewTokenInterval()

      if (!isSessionInitialized) {
        await getSdkConfig()?.onSdkInitialized?.()
        isSessionInitialized = true
      }
      success = true
      lastRefreshTokenDate = Date.now()

    } catch (err) {
      handleError(err, 'refreshTokenError', {
        isUnexpectedError: false,
        msgToDisplayToUser: getSdkConfig().refreshTokenErrorMessage,
        logoutUser: false,
        userActionChoice: 'contactSupport',
      })
    } finally {
      isRefreshing = false
    }
    return success
  }
}