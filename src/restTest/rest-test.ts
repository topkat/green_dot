
import 'typescript-generic-types'
import { square } from './rest-test-ascii-display'
// EXPORTS
export * from './rest-test-types'
export * from './rest-test-runner'
export * from './rest-test-types'

import { ValidatorObject, C, isObject, isset, validatorReturnErrArray, cleanStackTrace, moyenne, removeCircularJSONstringify, DescriptiveError, randomItemInArray } from 'topkat-utils'

const msg = {
    info: msg => `ⓘ  ${msg}`,
    warn: msg => `⚠  ${msg}`,
    error: msg => `✘  ${msg}`,
    success: msg => `✓  ${msg}`,
}

type MsgType = keyof typeof msg
type AssertionDescription = { description: string, msgType: MsgType, err?: any, }

export const restTest = {
    startSession(nbTestTotal: number, previousSave?: Record<string, any>) {
        restTest.history = []
        restTest.nbOfTests = 0
        if (previousSave) Object.assign(restTest, previousSave)
        restTest.nbTestTotal = nbTestTotal
        restTest.sessionStarted = true
    },
    getSave() {
        return {
            sessionStarted: restTest.sessionStarted,
            actualTestNb: restTest.actualTestNb,
            nbOfTests: restTest.nbOfTests,
            nbTestTotal: restTest.nbTestTotal,
            history: restTest.history,
            perfStatsForRoute: restTest.perfStatsForRoute,
            _assertionsWithoutHistory: restTest._assertionsWithoutHistory,
        }
    },
    newTest(testNb: number, testDescription: string) {
        if (!restTest.sessionStarted) return C.error('Please start a session before running tests')
        C.log('')
        C.info(testDescription)
        restTest.actualTestNb = testNb
        restTest.history[testNb] = { assertions: [], description: testDescription }
        restTest.nbOfTests++
    },
    sessionStarted: false,
    actualTestNb: 0,
    nbOfTests: 0,
    nbTestTotal: 999,
    history: [] as { description: string, assertions: AssertionDescription[] }[],
    perfStatsForRoute: {} as { [k: string]: number[] },
    _assertionsWithoutHistory: [] as AssertionDescription[],
    onError() { /***/ },
    _msg(msg: string, msgType: MsgType) {
        // _assertionsWithoutHistory
        const assertionArr = restTest.getActualTest()?.assertions || restTest._assertionsWithoutHistory
        assertionArr.push({ description: msg, msgType })
        C[msgType === 'warn' ? 'warning' : msgType](...(['error', 'warn'].includes(msgType) ? [false, msg] : [msg]))
    },
    getActualTest: () => restTest.history[restTest.actualTestNb],
    registerPerfForRoute(route, perf) {
        if (!isset(restTest.perfStatsForRoute[route])) restTest.perfStatsForRoute[route] = []
        restTest.perfStatsForRoute[route].push(perf)
    },
    info: (assertionDescription: string) => restTest._msg(assertionDescription, 'info'),
    success: (assertionDescription: string) => restTest._msg(assertionDescription, 'success'),
    warning: (assertionDescription: string) => restTest._msg(assertionDescription, 'warn'),
    simpleErrMsg: (assertionDescription: string) => restTest._msg(assertionDescription, 'error'),

    sectionTitle(str: string) {
        C.log('')
        C.log(C.blue(square(str)))
    },
    newErr(err, assertionDescription: string, errorExtraInfos: ObjectGeneric = {}, throwErr = true) {
        restTest.getActualTest().assertions.push({ description: assertionDescription, msgType: 'error', err })
        if (throwErr) throw new DescriptiveError(assertionDescription, {
            ...errorExtraInfos, code: undefined, extraInfosRenderer: extraInfos => {
                const errLogs: string[] = []
                for (const [errName, val] of Object.entries(extraInfos)) {
                    if (errName !== 'origin') errLogs.push((C.red(
                        `  * ${errName}: ${typeof val === 'undefined' ? 'undefined' : typeof val === 'string' ? val === '' ? '""' : val : removeCircularJSONstringify(val, 2)}`
                    )))
                }
                errLogs.splice(999, 99999)
                return errLogs
            }
        })
    },
    printStats() {
        const nbTests = restTest.history.length
        const allAssertions: AssertionDescription[] = [...restTest._assertionsWithoutHistory, ...restTest.history.reduce((allAssertions, historyItem) => [...allAssertions, ...(historyItem?.assertions || [])], [])]

        const errorLines = allAssertions.filter(({ msgType }) => ['error', 'warn'].includes(msgType))
        if (errorLines.length) {
            C.info(`ERRORS RESUME\n\n\n`)
            errorLines.forEach(({ msgType, description, err }) => {
                const fnNameInC = msgType === 'error' ? 'error' : 'warning'
                C[fnNameInC](false, msg[msgType](description))
                if (typeof err === 'object') {
                    C[fnNameInC](false, err)
                    if (err.stack) C.log(C.dim(cleanStackTrace(err.stack.replace(/^.*\n/, ''))))
                } else C[fnNameInC](false, err)
            })
        }
        C.log('\n')
        // eslint-disable-next-line no-console
        console.log('%%END%%') // THIS is a hook for parent process to know when it's the end
        C.log('\n\n\n')

        const lines = []

        const nbSuccess = allAssertions.filter(({ msgType }) => msgType === 'success').length
        const nbErrors = allAssertions.filter(({ msgType }) => msgType === 'error').length
        const nbWarnings = allAssertions.filter(({ msgType }) => msgType === 'warn').length

        const requestMsArray = Object.values(restTest.perfStatsForRoute).flat().sort((a, b) => a - b)

        const averageTimePerRequest = Math.round(moyenne(requestMsArray))
        const medianTimePerRequest = requestMsArray.length ? requestMsArray[Math.round(requestMsArray.length / 2)] : undefined

        const heroRank = randomItemInArray(['HERO', 'BIG WHEELIE', 'FINAL BOSS', 'CODE GOD'])
        const randomGuyRank = randomItemInArray([
            'Wordpress developer',
            'Internet explorer user',
            'Random guy trying to do tech',
            'Super grandma',
            'Gobelin lv.3',
            'Half-way hacker',
        ])

        const rank = nbErrors === 0 ? heroRank : randomGuyRank
        const rankColor = nbErrors === 0 ? 'green' : nbErrors < 2 ? 'yellow' : 'red'

        lines.push(C.dim(`-- STATS --`), '')
        lines.push('Nb assertions   ' + allAssertions.length)
        lines.push('Nb tests:       ' + nbTests + '/' + restTest.nbTestTotal)
        lines.push(C.green('Success:      ✓ ' + nbSuccess))
        lines.push(C.red('Errors:       ✘ ' + nbErrors))
        lines.push(C.yellow('Warnings:     ⚠ ' + nbWarnings))

        lines.push(C.blue('Score percent:% ' + Math.floor((100 / allAssertions.length) * (nbSuccess + nbWarnings))))
        lines.push('', C.dim(`-- PERFS --`))
        lines.push(`Average time per request: ${averageTimePerRequest}ms`)
        if (requestMsArray.length) lines.push(`Median time per request:  ${medianTimePerRequest}ms`)

        lines.push('', C.dim(`-- RESULT --`))
        lines.push('Rank: ' + C[rankColor](rank))
        if (requestMsArray.length) {
            lines.push(`Performance NUTRISCORE®: ${medianTimePerRequest < 50 ? C.green('A') : medianTimePerRequest < 80 ? C.green('B') : medianTimePerRequest < 120 ? C.yellow('C') : medianTimePerRequest < 150 ? C.red('D') : C.red('E')}`)
        }

        C.log(square(lines, 49))

        return { nbErrors }
    },
}

type ExtraAssertConfigs = {
    warningMessage?: boolean,
    errorMessage?: boolean
    infoMessage?: boolean
}

/** if validatorObject param is not set then it will consider checking that the value is set. Eg:
 * * assert(myVar, `myVar`, { type: 'email' }) // assert that my var type is email, see autocompletion for types options
 * * assert(myVar, `myVar`, 'VALUE') // assert that my var === 'VALUE', works for numbers also
 * * assert(myVar, `myVar`, true) // assert that my var === true
 * * assert(myVar, `myVar`) // assert that my var is set
 * * assert(myVar, `myVar`, { gt: 4 }) // you can pass any validation config (see ts autocompletion)
 */
export function assert(
    value: any | undefined,
    description: string,
    validatorObject?: (ValidatorObject & ExtraAssertConfigs) | number | boolean | string,
    config?: { bypassIssetCheck: boolean }
) {

    let testDescription = ''
    const { bypassIssetCheck = false } = config || {}

    const validatorObjReal: ValidatorObject = {}
    const descriptionClean = description.replace(/\?\./g, '.').trim()

    if (isObject(validatorObject)) Object.assign(validatorObjReal, validatorObject)
    else if (isset(validatorObject)) validatorObjReal.eq = validatorObject

    if (validatorObjReal.warningMessage) restTest.warning(description)
    else if (validatorObjReal.errorMessage) restTest.simpleErrMsg(description)
    else if (validatorObjReal.infoMessage) restTest.info(description)
    else {

        const issetCheck = bypassIssetCheck === false && (!isset(validatorObject) || !['mustNotBeSet', 'isset', 'optional'].some(k => k in validatorObjReal))
        if (issetCheck) validatorObjReal.isset = true

        if ('in' in validatorObjReal && validatorObjReal.in.length === 1) {
            // CONVERT { in: [singleValue] => eq: singleValue } for READABILITY
            validatorObjReal.eq = validatorObjReal.in[0]
            delete validatorObjReal.in
        }

        const shouldAssert = Object.entries(validatorObjReal).sort(a => a[0] === 'isset' ? -1 : 0)
        for (const [assertName, assertVal] of shouldAssert) {
            testDescription = descriptionClean + ' ' + displayAssertionClean(assertName, assertVal)
            const validationObjForAssert = { value, [assertName]: assertVal }
            const [errMsg, extraInfos] = validatorReturnErrArray(validationObjForAssert)
            if (isset(errMsg)) restTest.newErr(errMsg, testDescription, extraInfos)
            else restTest.success(testDescription)
        }
    }

}

type AssertTranslationArr = [assertName: string, convertValueFn?: (val: any) => any]

function displayAssertionClean(assertName: string, assertVal: any) {

    const translations: { [k in keyof ValidatorObject]: string | AssertTranslationArr } = {
        eq: 'is equal to',
        gt: 'is greater than',
        lt: 'is lesser than',
        lte: 'is lesser than or equal',
        gte: 'is greater than or equal',
        in: ['is included in', val => `[${val.join(', ')}`],
        isArray: ['is an array'],
        maxLength: 'has a max length of',
        minLength: 'has a min length of',
        mustNotBeSet: ['must not be set'],
        length: 'has an expected length of',
        type: 'is type',
        neq: 'is not equal to',
        regexp: 'should match regexp',
    }
    const [assertStr = assertName, convertValueFn = () => ''] = Array.isArray(translations[assertName]) ? translations[assertName] as AssertTranslationArr : [translations[assertName], val => val]
    const convertedValue = convertValueFn(assertVal)
    const valueStr = convertedValue?.toString() || convertedValue

    return `${assertStr} ${valueStr}`
}