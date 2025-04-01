


import { removeCircularJSONstringify, generateObjectId, DescriptiveError } from 'topkat-utils'
import { log } from './logger'
import { trackerEvent } from './tracker'
import { logout } from './loginHelper'
import { isBackendInitialized } from './initBackend'
import { get$ } from './init'
import { Device } from './device.web'


//----------------------------------------
// INITIALIZATION
//----------------------------------------
export function initErrorHandler<ErrorConfig>(config: HandleErrorBaseConfig<ErrorConfig>) {
  Object.assign(handleErrBaseConfig, config)
}

const handleErrBaseConfig: HandleErrorBaseConfig = { genericErrorMessage: 'An error has occured.' }

export type HandleErrorBaseConfig<ErrorConfig = {}> = {
  getUserId?(): MaybePromise<string>
  getDeviceInfos?(): Device
  getActualScreen?(): string
  onError?(errorDescriptionObject: ErrorDescriptionObject & ErrorConfig): MaybePromise<any>
  genericErrorMessage: string,
}

type ErrorDescriptionObject<ErrorConfig = any> = {
  message: string
  errorId: string
  error: any
} & HandleErrorConfig<ErrorConfig>


export type HandleErrorConfig<ErrorConfig = any> = {
  /** Message that may be displayed to user if any */
  msgToDisplayToUser?: string
  /** Which actions are proposed to user, those actions shall
   * be implemented for each project in the onError() callback
   * when initiating error handler */
  userActionChoice?: 'contactSupport' // 'reloadApp' | 'sendToSupport'
  /** This will enable reporting the error directly to the tech team trough teams channel */
  isUnexpectedError?: boolean
  /** Is the error supposed to logout the user ? */
  logoutUser?: boolean
  /** Any contextual infos that you can provide should be there */
  extraInfos?: Record<string, any>
  /** Placeholder */
  displayMessageToUser?: any
} & ErrorConfig

//----------------------------------------
// HANDLE ERROR
//----------------------------------------
/** Use this function to inject the right custom type to the third param of handleError() */
export function getHandleErrorTyped<ErrorConfig>() {
  return handleError as (error, message: string, config: HandleErrorConfig<ErrorConfig>) => void
}

/** This function will:
 * * Take the most out of the error
 * * put isHandled prop to true it has not been done (see backend.svc errors)
 * * handle proper logging
 * * sendErrorToBackend if it's an unexpected one
 * * logout the user if configured
 */
export async function handleError(
  error,
  message: string,
  config: HandleErrorConfig
) {
  try {

    if (error?.isHandled === true) return

    const errorId = generateObjectId()
    const { isUnexpectedError, logoutUser, extraInfos = {}, displayMessageToUser } = config || {}
    let { msgToDisplayToUser } = config || {}

    if (error.extraInfos) Object.assign(extraInfos, error.extraInfos)

    if (error && error?.isHandled !== undefined) error.isHandled = true

    log.error(`${isUnexpectedError ? 'ErrorId' : 'UnexpectedErrorId'}: ${errorId} => ` + message)
    log.error(error)
    if (error.stack) {
      extraInfos.stackTrace = error.stack
      // TODO this may not be needed as console.error already displays the stack trace, however providing it to the backend can still be a good idea
      log.error('STACK TRACE:')
      log.error(error.stack)
    }

    if (displayMessageToUser !== 'none' && (isUnexpectedError || typeof msgToDisplayToUser === 'string')) {
      if (!msgToDisplayToUser) msgToDisplayToUser = handleErrBaseConfig.genericErrorMessage
      await handleErrBaseConfig?.onError({ msg: message, errorId, error, msgToDisplayToUser, ...config })
    }
    trackerEvent('error', { errorId, errMsg: message })
    if (isUnexpectedError) sendErrortoBackend(error, message, extraInfos, errorId) // not awaited because parallel

    if (logoutUser && isBackendInitialized()) await logout()
  } catch (err) {
    log.error('HANDLE ERROR ERROR: dude, if this happens, we are in the S**T')
    log.error(err)
  }
}


//----------------------------------------
// SEND ERRORS TO BACKEND
//----------------------------------------
/** This function will send error to the backend for it can trigger admin and dev team notification, while providing as much as contextual informations as possible */
async function sendErrortoBackend(
  error,
  message: string = error?.message || error?.name || (error as DescriptiveError)?.message || error.toString(),
  extraInfos = {} as Record<string, any>,
  errorId?: string,
) {
  try {
    const userId = await handleErrBaseConfig?.getUserId()

    const deviceInfos = await handleErrBaseConfig?.getDeviceInfos()

    if (typeof extraInfos === 'object') extraInfos.screen = handleErrBaseConfig?.getActualScreen()

    await get$().frontendErrorHandler({
      title: message,
      errorId,
      deviceId: deviceInfos._id,
      deviceInfos,
      deviceType: deviceInfos.deviceType,
      deviceName: deviceInfos.deviceName,
      applicationVersion: global?.APP_VERSION,
      stackTrace: error?.stack,
      extraInfos: (Object.keys(extraInfos).length ? removeCircularJSONstringify(extraInfos) + '\n\n' : '') + removeCircularJSONstringify(error?.errorDescription || {}, 2),
      userId,
    })
  } catch (err) {
    log.error(removeCircularJSONstringify(err))
  }
}