


```ts 
import {$, initSdk} from 'appUserSDK'
//----------------------------------------
  // INIT BACKEND
  //----------------------------------------
  initSdk({
    projectName,
    onLogout: () => {
      getSessionState().setSession({ status: 'notAuthenticated' })
      Object.keys(window.localStorage).forEach(k => {
        if (k !== 'deviceId' && k !== 'BANGK-language' && k !== 'BANGK-currency') {
          window.localStorage.removeItem(k)
          // setTimeout(() => location.reload(), 2000)
        }
      })
    },
    getDeviceId: () => getDeviceInfos()._id,
    onBackendInitialized: () => {/** TODO */ },
    getQueryClient: () => queryClient,
    localStorageSet: (name, val) => localStorage.setItem(name, val),
    localStorageGet: name => localStorage.getItem(name),
    localStorageRemove: name => localStorage.removeItem(name),
    refreshTokenExpirationMinutes,
    refreshTokenErrorMessage: t('errors.wrongToken'),
    wrongTokenErrorMessage: t(`errors.refreshTokenError`),
    serverUrls: {
      backend: serverUrl,
      default: 'backend',
    },
    onErrorCallback: backendErrHandler,
  })

  //----------------------------------------
  // INIT TRACKER
  //----------------------------------------
  if (isTrackerEnabled) {
    initTrackerData({
      projectName,
      getDeviceId: () => getDeviceInfos()._id,
    })
    initTrackerListeners({ isDev })
  }

```