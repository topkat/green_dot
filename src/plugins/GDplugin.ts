import { svc } from '../service'
import { GreenDotAppConfig } from '../types/appConfig.types'
import { GenericDef } from 'good-cop'

export class GDplugin<Name extends string> {
  protected readonly name: Name
  protected readonly version: string

  /** Will register those services into the app and SDK and eventually expose configured routes */
  serviceToRegister: Record<string, ReturnType<typeof svc>> = {}

  onInit?: () => any

  handlers: GDpluginHandlers[] = []

  addUserAdditionalFields?(): Record<string, GenericDef | GenericDef[]>

}

export type GDpluginHandlers = {
  /** The lower, the prior. From 0 to 100 */
  priority?: number
} & ({
  event: 'onLogin'
  callback: GreenDotAppConfig['onLoginCallback']
})

export type GDpluginHandlerEventNames = GDpluginHandlers['event']