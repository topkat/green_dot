
import nodeSchedule from 'node-schedule'
import { Definition } from 'good-cop'
import { asArray, C, isset, isValid, camelCaseToWords, kebabCase } from 'topkat-utils'

import { doPermApplyToCtx } from '../security/doPermApplyToCtx'
import { error } from '../core.error'
import { newSystemCtx } from '../ctx'
import event from '../event'
import { AllServicesKeys, Schedule, ServiceClean } from '../types/core.types'
import clientAppConfig from '../cache/green_dot.app.config.cache'
import { parseForClause } from '../security/helpers/parseForClause'


export async function registerServices(isPrimaryCluster = true) {

    const allRoutesFromServices = {}

    //----------------------------------------
    // REGISTER SERVICES
    //----------------------------------------
    const allServicesToExpose = {} as typeof clientAppConfig.services[string]
    const scheduleLogMessages = []

    for (const [mainName, services] of Object.entries(clientAppConfig.services)) {
        for (const [serviceName, service] of Object.entries(services)) {
            if (typeof service.main === 'function') {
                const routeName = mainName === serviceName ? mainName : serviceName
                if (typeof allServicesToExpose[routeName] !== 'undefined') error.serverError(null, 'duplicateServiceName', { svcName: routeName })
                allServicesToExpose[routeName] = service
            }
        }
    }

    for (const [serviceName, service] of Object.entries(allServicesToExpose)) {
        try {

            const hasRoute = ('route' satisfies AllServicesKeys) in service
            const hasParamValidator = ('input' satisfies AllServicesKeys) in service
            const hasPerms = ('for' satisfies AllServicesKeys) in service

            const isSchedule = ('schedule' satisfies AllServicesKeys) in service
            const isEvent = ('on' satisfies AllServicesKeys) in service
            const isApi = hasRoute || (!isSchedule && !isEvent)

            const doNotValidate = ('doNotValidate' satisfies AllServicesKeys) in service ? service.doNotValidate : false

            const forParsed = hasPerms ? parseForClause(service.for) : []

            const { forEnv } = service

            const isForEnv = !forEnv ? true : forEnv?.includes(process.env.NODE_ENV as Env)


            const errExtraInfos: Record<string, any> = { serviceName, apiMethod: (service as any)?.method, route: (service as any)?.route }

            //----------------------------------------
            // VALIDATE PARAMS
            //----------------------------------------
            const parsedParamValidator: Definition[] = []

            if (hasParamValidator) {
                for (const [paramNumber, originalValidator] of Object.entries(service.input)) {

                    // required by default
                    const isFieldOptional = originalValidator.getDefinitionValue('required') === false
                    let paramValidator = (isFieldOptional ? originalValidator : originalValidator.required())
                        // add extra infos
                        .errorExtraInfos({ paramNumber, ...errExtraInfos })

                    // <DEFAULT OBJ> If a param is type object and all values are optional, it should
                    // default to an empty object
                    const mainType = paramValidator.getMainType()
                    if (mainType === 'object') {
                        const objDef = paramValidator._definitions.find(d => d.name === 'object')
                        if (objDef && 'objectCache' in objDef) {
                            const someRequired = Object.values(objDef.objectCache).some(def => def.getDefinitionValue('required') === true)
                            if (!someRequired) {
                                paramValidator = paramValidator.default({}) as typeof paramValidator
                            }
                        }
                    }
                    // </DEFAULT OBJ>
                    parsedParamValidator.push(paramValidator as any as Definition)
                }
            }

            //----------------------------------------
            // MAIN SERVICE WRAPPER
            //----------------------------------------
            const svcWrapperFn = async (ctx: Ctx, ...params) => {
                returnErrIfWrongEnv()

                errExtraInfos.userRole = ctx.role

                // PERMISSIONS CHECKS
                let doPermApply = isApi ? false : true
                if (hasPerms) {
                    doPermApply = await doPermApplyToCtx(
                        ctx,
                        forParsed,
                        'alwaysReturnTrue', 'matchStrict', 'alwaysReturnTrue'
                    )
                }

                // 2FA, PINCODE, FINGERPRINT CHECKS
                if (isApi) {
                    const svc = service as ServiceClean
                    if (svc.authorizedAuthentications.length) {
                        const isValid = svc.authorizedAuthentications.some(authMethod => ctx.authenticationMethod.includes(authMethod))
                        if (!isValid) error.secureAuthenticationRequired(ctx, { ...errExtraInfos, fn: 'registerService.additionalAuthenticationRequired', requiredAuthentication: svc.authorizedAuthentications })
                    }
                }

                if (!doPermApply) error.userDoNotHaveThePermission(ctx, { ...errExtraInfos, forPerm: hasPerms ? service.for : undefined, userPermissions: ctx.permissions, fn: 'registerService.doPermApplyToCtxService' })

                let newParams = [{}]
                // TODO those checks should not be made if it doesn't pass by api route
                if (doNotValidate !== true) {
                    // params validation
                    for (const [paramNumber, validator] of Object.entries(parsedParamValidator)) {
                        newParams[paramNumber] = await validator.formatAndValidate(
                            params[paramNumber],
                            {
                                user: ctx.getUserMinimal(),
                                addressInParent: paramNumber,
                                parentObj: params,
                            }
                        )
                    }
                } else newParams = params
                // main function execution
                return await (service.main as any)(ctx, ...newParams)
            }

            //----------------------------------------
            // API ROUTE
            //----------------------------------------
            if (isForEnv && isApi) {
                const definedRouteName = hasRoute ? service.route : kebabCase(camelCaseToWords(serviceName))
                if (isset(allRoutesFromServices[definedRouteName])) {
                    error.serverError(null, 'Two services have the same API endpoint', { endPoint: definedRouteName, serviceNames: [serviceName, allRoutesFromServices[definedRouteName].serviceName] })
                }
                allRoutesFromServices[definedRouteName] = {
                    ...service,
                    main: svcWrapperFn,
                    serviceName,
                    isPublic: forParsed.some(p => p.role === 'public')
                }
            }

            //----------------------------------------
            // EVENTS
            //----------------------------------------
            if (isForEnv && isEvent) for (const eventName of asArray(service.on)) event.on(eventName as any, svcWrapperFn, service.priority)

            //----------------------------------------
            // SCHEDULE
            //----------------------------------------
            if (isForEnv && isSchedule && isPrimaryCluster) {

                const { schedule } = service

                if (clientAppConfig.serverConfig.enableSchedules) {
                    const isProd = clientAppConfig.serverConfig.env === 'preprod' || clientAppConfig.serverConfig.env === 'production'

                    const scheduleObj: Schedule = typeof schedule === 'string' ? { frequency: schedule } : schedule
                    if (!isValid({ name: 'scheduleFileFreq', value: scheduleObj.frequency })) error.serverError(null, `module.schedule.frequency should be set. Please, check service: ${serviceName}`)

                    const { frequency, frequencyTestEnv, frequencyDevEnv = frequency } = scheduleObj
                    const frequencyForEnv = clientAppConfig.serverConfig.env === 'test' && isset(frequencyTestEnv) ? frequencyTestEnv : !isProd ? frequencyDevEnv : frequency

                    scheduleLogMessages.push(`  ${serviceName.padEnd(27, ' ')} actual:${frequencyForEnv} prod:${frequency}`)

                    if (isProd && scheduleObj.frequency === '* * * * *') {
                        error.serverError(null, 'SCHEDULER EVERY MINUTES !', { schedule, serviceName })
                    }
                    const callbackWrapper = async () => {
                        try {
                            C.info('Starting cronjob ' + serviceName)
                            await svcWrapperFn(newSystemCtx())
                            C.success('Ending cronjob ' + serviceName)
                        } catch (err) { error.scheduleError(null, { err }) }
                    }
                    // Start schedules only when
                    event.on('server.start', () => {
                        if (frequencyForEnv === 'server.start') setTimeout(() => callbackWrapper(), 1000)
                        else if (frequencyForEnv !== 'never') nodeSchedule.scheduleJob(frequencyForEnv, callbackWrapper)
                    }, 1)
                } else C.warning(false, 'SCHEDULE DISABLED ON THIS SERVER')
            }
        } catch (err) {
            error.serverError(null, 'Error while registering service', { serviceName, err })
        }
    }

    return allRoutesFromServices
}



function returnErrIfWrongEnv(forEnv?: Env) {
    if (forEnv) {
        const env = clientAppConfig.serverConfig.env
        const isWrongEnvStr = typeof forEnv === 'string' && env !== forEnv
        const isWrongEnvArr = Array.isArray(forEnv) && !forEnv.includes(env)
        if (isWrongEnvStr || isWrongEnvArr) {
            error.serverError(null, 'wrongEnv', { actualEnv: env, authorizedEnv: forEnv })
        }
    }
}