

import { isset, DescriptiveError, objEntries, isObject } from 'topkat-utils'
import { env } from '../helpers/getEnv'

export function getExpressErrHandlerMW() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (err: DescriptiveError, req, res, next) { // /!\ will not work if next is not defined
        if (isset(err.log) && !err.hasBeenLogged) err.log()
        else if (!isset(err.log)) {
            // NON DESCRIPTIVE ERRORS
            const isStrErr = typeof err === 'string'
            const errMsg = (isStrErr ? err : err.message) as string
            const extraInfos = {
                doNotDisplayCode: true,
                doNotWaitOneFrameForLog: true,
                code: 500,
                err,
                ...(err.options || err.options || {}),
            }

            if (!isStrErr) {
                extraInfos.err = err
            }
            // convert foreign errors to DescriptiveError format
            err = new DescriptiveError(
                errMsg,
                extraInfos
            )
            err.log()
        }
        err.errorDescription.route = req.originalUrl
        err.errorDescription.platform = req.headers?.platform

        let description = err.errorDescription

        if (env.isProd) {
            // MASK SENSITIVE INFORMATIONS IN PRODUCTION IN RESPONSE BUT NOT IN LOGS
            description = {} as any
            for (const [k, o] of objEntries(err.errorDescription)) {
                if (k === 'maskForFront') continue
                // const containsBadWord = ['password', 'token'].some(badWord => k.toLocaleLowerCase().includes(badWord))
                const isObj = isObject(o) || Array.isArray(o)
                if (isObj) description[k] = 'censored'
                else description[k] = o
            }
        }

        return res.status(err.code || 500).json(description)
    }
}