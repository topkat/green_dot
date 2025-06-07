
import { asArray } from 'topkat-utils'
import { ScheduleService, Service, ServiceClean } from './types/services.types.js'
import { _, Definition, GenericDef } from './lib/good-cop/index-backend.js'
import { notForToFor } from './security/notForToForAndNotOnToOn.js'

/** This is the base function for registering services. It handle types as
  * well as basic service cleanup. So it takes a Service and return a ServiceClean
  */
export function svc<
  InputType extends Record<string, GenericDef> | GenericDef | GenericDef[] = [],
  OutputType extends GenericDef = undefined
>(svc: Service<InputType, OutputType>) {

  const svcClean = ({ authorizedAuthentications: [], ...svc } as any as ServiceClean<Service<InputType, OutputType>>)

  if (svc.input) {
    // object to definition
    if (svc.input && !Array.isArray(svc.input) && 'tsTypeRead' in svc.input === false) {
      const inpt = svc.input as Record<string, Definition>
      const isRequired = Object.values(inpt).some(i => i.getDefinitionValue('required'))

      svcClean.input = svc.input = _.n('props').object(inpt).required() as any

      if (isRequired) svcClean.input = (svc.input as any as Definition).required() as any
    }

    // !array to array
    if (!Array.isArray(svcClean.input)) {
      svcClean.input = asArray(svcClean.input) as any
    }
  } else svcClean.input = []

  // remove notFor and assign to for
  if (svc.notFor) {
    svcClean.for = notForToFor(asArray(svc.notFor)) as any
    delete (svcClean as any).notFor
  }

  // route as array to route + method
  if (Array.isArray(svc.route)) {
    svcClean.method = svc.route[0]
    svcClean.route = svc.route[1]
  }

  // inject empty object a sdefault 1st param to allow 1st param of main
  // to be spreaded eventhough it's optional and is not passed
  svcClean.main = (ctx, ...otherParams) => {
    return svc.main(ctx, ...(otherParams.length ? otherParams : [{}]) as any)
  }

  // doc as object
  if (svc.doc && typeof svc.doc === 'string') svcClean.doc = { description: svc.doc }

  // authenticationMethods aliases
  if (svc.needs2FA) {
    svcClean.authorizedAuthentications.push('2FA')
  }

  if (svc.needsFingerprintOrPincode) {
    svcClean.authorizedAuthentications.push('biometricAuthToken', 'pincode')
  }

  svcClean.hasBeenParsed = true

  return svcClean
}



export function schedule(schedule: ScheduleService) {
  return schedule
}