import { get$ } from './init.js'
import { getSdkConfig } from './initSdk.js'
import { clearLastRefreshTokenDate } from './loginHelper.js'



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
    clearLastRefreshTokenDate()
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