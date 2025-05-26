import { svc } from '../service'

export class GDplugin<Name extends string> {
  protected readonly name: Name
  protected readonly version: string

  serviceToRegister: (() => ReturnType<typeof svc>)[] = []
  onInit?: () => any

}