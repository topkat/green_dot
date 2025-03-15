
import nodeSchedule from 'node-schedule'
import { Definition } from 'good-cop'
import { asArray, C, isset, isValid, camelCaseToWords, kebabCase, objEntries } from 'topkat-utils'

import { doPermApplyToCtx } from '../security/doPermApplyToCtx'
import { throwError } from '../core.error'
import { newSystemCtx } from '../ctx'
import event from '../event'
import { AllServicesKeys, Schedule, ServiceClean } from '../types/core.types'
import { parseForClause } from '../security/helpers/parseForClause'
import { getActiveAppServices } from '../helpers/getProjectServices'
import { getActiveAppConfig } from '../helpers/getGreenDotConfigs'
import { env } from '../helpers/getEnv'


export async function registerServices(isPrimaryCluster = true) {

    const allRoutesFromServices = {}

    //----------------------------------------
    // REGISTER SERVICES
    //----------------------------------------
    const appConfig = await getActiveAppConfig()

    const services = await getActiveAppServices()
    const scheduleLogMessages = []
    const registeredServiceNames = [] as string[]

    for (const [serviceName, service] of objEntries(services)) {

        if (typeof service.main !== 'function') continue

        if (registeredServiceNames.includes(serviceName)) {
            throwError.serverError(null, 'duplicateServiceName', { svcName: serviceName })
        }

        registeredServiceNames.push(serviceName)

        try {

            const hasRoute = ('route' satisfies AllServicesKeys) in service
            const hasParamValidator = ('input' satisfies AllServicesKeys) in service
            const hasPerms = ('for' satisfies AllServicesKeys) in service

            const isSchedule = ('schedule' satisfies AllServicesKeys) in service
            const isEvent = ('on' satisfies AllServicesKeys) in service
            const isApi = hasRoute || (!isSchedule && !isEvent)

            const doNotValidate = ('doNotValidate' satisfies AllServicesKeys) in service ? service.doNotValidate : false

            const forParsed = hasPerms ? await parseForClause(service.for) : []

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
                        if (!isValid) throwError.secureAuthenticationRequired(ctx, { ...errExtraInfos, fn: 'registerService.additionalAuthenticationRequired', requiredAuthentication: svc.authorizedAuthentications })
                    }
                }

                if (!doPermApply) throwError.userDoNotHaveThePermission(ctx, { ...errExtraInfos, forPerm: hasPerms ? service.for : undefined, userPermissions: ctx.permissions, fn: 'registerService.doPermApplyToCtxService' })

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
                    throwError.serverError(null, 'Two services have the same API endpoint', { endPoint: definedRouteName, serviceNames: [serviceName, allRoutesFromServices[definedRouteName].serviceName] })
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

                if (appConfig.enableSchedules) {
                    const scheduleObj: Schedule = typeof schedule === 'string' ? { frequency: schedule } : schedule
                    if (!isValid({ name: 'scheduleFileFreq', value: scheduleObj.frequency })) throwError.serverError(null, `module.schedule.frequency should be set. Please, check service: ${serviceName}`)

                    const { frequency, frequencyTestEnv, frequencyDevEnv = frequency } = scheduleObj
                    const frequencyForEnv = env.isTest && isset(frequencyTestEnv) ? frequencyTestEnv : !env.isProd ? frequencyDevEnv : frequency

                    scheduleLogMessages.push(`  ${serviceName.padEnd(27, ' ')} actual:${frequencyForEnv} prod:${frequency}`)

                    if (env.isProd && scheduleObj.frequency === '* * * * *') {
                        throwError.serverError(null, 'SCHEDULER EVERY MINUTES !', { schedule, serviceName })
                    }
                    const callbackWrapper = async () => {
                        try {
                            C.info('Starting cronjob ' + serviceName)
                            await svcWrapperFn(newSystemCtx())
                            C.success('Ending cronjob ' + serviceName)
                        } catch (err) { throwError.scheduleError(null, { err }) }
                    }
                    // Start schedules only when
                    event.on('server.start', () => {
                        if (frequencyForEnv === 'server.start') setTimeout(() => callbackWrapper(), 1000)
                        else if (frequencyForEnv !== 'never') nodeSchedule.scheduleJob(frequencyForEnv, callbackWrapper)
                    }, 1)
                } else C.warning(false, 'SCHEDULE DISABLED ON THIS SERVER')
            }
        } catch (err) {
            throwError.serverError(null, 'Error while registering service', { serviceName, err })
        }
    }

    return allRoutesFromServices
}



function returnErrIfWrongEnv(forEnv?: Env) {
    if (forEnv) {
        const isWrongEnvStr = typeof forEnv === 'string' && env.env !== forEnv
        const isWrongEnvArr = Array.isArray(forEnv) && !forEnv.includes(env)
        if (isWrongEnvStr || isWrongEnvArr) {
            throwError.serverError(null, 'wrongEnv', { actualEnv: env, authorizedEnv: forEnv })
        }
    }
}