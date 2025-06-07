import { ErrorObject } from '../error.js'
import { svc } from '../service.js'
import { GreenDotAppConfig } from '../types/appConfig.types.js'
import { GenericDef } from '../lib/good-cop/index-backend.js'

export abstract class GDplugin<Name extends string> {

  abstract readonly name: Name

  /** Will register those services into the app and SDK and eventually expose configured routes */
  serviceToRegister: Record<string, ReturnType<typeof svc>> = {}

  onInit?: () => any

  handlers: GDpluginHandlers[] = []

  addUserAdditionalFields?(): Record<string, GenericDef | GenericDef[]>

  /** Use this to register new errors to use via ctx.error.myCustomError
  * * Don't forget to also put that code at the end of your plugin
  * ```
  * declare global {
  *   interface GreenDotErrors extends RegisterErrorType<GDmanagedLogin['errors']> { }
  * }
  * ```
  */
  errors?: ErrorObject
}

export type GDpluginHandlers = {
  /** The lower, the prior. From 0 to 100 */
  priority?: number
} & ({
  event: 'onLogin'
  callback: GreenDotAppConfig['onLoginCallback']
})

export type GDpluginHandlerEventNames = GDpluginHandlers['event']