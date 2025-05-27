import { svc } from '../service'
import { GreenDotAppConfig } from '../types/appConfig.types'

export class GDplugin<Name extends string> {
  protected readonly name: Name
  protected readonly version: string

  /** Will register those services into the app and SDK and eventually expose configured routes */
  serviceToRegister: ReturnType<typeof svc>[] = []

  onInit?: () => any

  handlers: GDpluginHandlers[] = []

}

export type GDpluginHandlers = {
  /** The lower, the prior. From 0 to 100 */
  priority?: number
} & ({
  event: 'onLogin'
  callback: GreenDotAppConfig['onLoginCallback']
})

export type GDpluginHandlerEventNames = GDpluginHandlers['event']