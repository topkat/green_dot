import { GreenDotAppConfig } from '../types/appConfig.types'

export type RestMethod = 'POST' | 'GET' | 'PATCH' | 'DELETE'

export type TestFn<TestEnv, ExpectedReturnType> = (env: TestEnvExtended<TestEnv>) => MaybePromise<ExpectedReturnType>
export type TestType<TestEnv, ExpectedType> = ExpectedType | TestFn<TestEnv, ExpectedType>

type TestEnvExtended<TestEnv> = TestEnv & { [k: string]: any }

type Statuses = 200 | 400 | 401 | 402 | 403 | 404 | 409 | 422 | 429 | 500 | 503

type HttpHeaders = {
    Accept?: string
    'Content-Type'?: string
    [k: string]: string
}

interface Test2<TestUserNames extends string, ConnexionInfos extends Record<string, any>, RestTestConfigType extends GreenDotApiTestsConfig> {
    /** d stands for description and is meant to describe the action / route in the most readable format: d: [403, 'userA', 'create a transaction with more that the maximum amount'] */
    d?:
    [Statuses, TestUserNames | ConnexionInfos | 'public' | 'system', string]
    | [TestUserNames | ConnexionInfos | 'public' | 'system', string],
    // TODO route, main and svc cannot be used at the same time, so they need to be exclusively typoed
    route?: TestType<RestTestConfigType['env'], string> // , main?: any, svc?: any
    main?: TestFn<RestTestConfigType['env'], void> // , route?: any, svc?: any
    svc?: TestFn<RestTestConfigType['env'], any> // , route?: any, main?: any

    method?: TestType<RestTestConfigType['env'], RestMethod>
    headers?: TestType<RestTestConfigType['env'], HttpHeaders>
    as?: TestType<RestTestConfigType['env'], TestUserNames | ConnexionInfos | 'public' | 'system'>
    apiKey?: TestType<RestTestConfigType['env'], keyof RestTestConfigType['apiKeys']>
    auth?: TestType<RestTestConfigType['env'], string>
    status?: TestType<RestTestConfigType['env'], Statuses | Statuses[] | readonly Statuses[]>
    params?: TestType<RestTestConfigType['env'], NotFunction<any>[]>
    body?: TestType<RestTestConfigType['env'], ObjectGeneric>,
    /** expected status: 200 OR [404, 403] if multiple status could be expected */
    doc?: string
    /** Display a warning message when running the test, can be useful to display 'Should be refactored' like warnings' */
    warning?: string
    /** Display a message info when running the test, can be useful to display '' like info */
    info?: string
    /** Expected error message */
    errorMessage?: TestType<RestTestConfigType['env'], string>
    before?: TestFn<RestTestConfigType['env'], void>
    after?: ((env: TestEnvExtended<RestTestConfigType['env']>, reponse: any) => void) | ((env: TestEnvExtended<RestTestConfigType['env']>, reponse: any) => Promise<void>)
    /** Determine if the test shall run or not depending on env, useful if you want to disable test for some iterations */
    shallRun?: TestType<RestTestConfigType['env'], boolean>
    /** This test will run in parallel of the other ones, so the suite will continue while this test is finishing */
    runInParallel?: TestType<RestTestConfigType['env'], boolean>
    /** match servers props in restTestConfig  */
    server?: keyof RestTestConfigType['servers']
    /** will replace config.serverBaseUrl */
    serverUrl?: TestType<RestTestConfigType['env'], string>
    /** wait a predefined amount of seconds before running that test */
    waitSecBefore?: number
    /** wait a predefined amount of seconds after running that test */
    waitSecAfter?: number
    /** Will display a message in case of error */
    onErrorMsg?: string | GenericFunction
}

// TODO clean that as it's needed for module extension
export interface Test<TestUserNames extends string, ConnexionInfos extends Record<string, any>, RestTestConfigType extends GreenDotApiTestsConfig> extends Test2<TestUserNames, ConnexionInfos, RestTestConfigType> { }


export type TestItem<TestUserNames extends string = any, ConnexionInfos extends Record<string, any> = any, RestTestConfigType extends GreenDotApiTestsConfig = any> = (TestElement<TestUserNames, ConnexionInfos, RestTestConfigType> | TestSuite<TestUserNames, ConnexionInfos, RestTestConfigType>)


export type TestSuiteRaw<TestUserNames extends string = any, ConnexionInfos extends Record<string, any> = any, RestTestConfigType extends GreenDotApiTestsConfig = any> = {
    name?: string
    defaults?: TestType<RestTestConfigType['env'], Partial<Test<TestUserNames, ConnexionInfos, RestTestConfigType>>>
    /** The lesser the better priority */
    priority?: number
    /** This test will run even if a filter is passed or solo option is active on one test */
    mandatory?: boolean
    /** if active, only this test suite will run and the mandatory ones. Remove this when commiting */
    solo?: boolean
    // TODO dependsOn setting
    disable?: true
    disableTemporarly?: `${number}${number}${number}${number}${number}${number}${number}${number}`
    items: TestItem<TestUserNames, ConnexionInfos, RestTestConfigType>[]
    /** This is meant to be played before reloading a test suite when a user click continue or
     *  replayLast when a previous test has failed
     */
    beforeReloadAll?: TestElement<TestUserNames, ConnexionInfos, RestTestConfigType>[]
}

export type TestSuite<TestUserNames extends string = any, ConnexionInfos extends Record<string, any> = any, RestTestConfigType extends GreenDotApiTestsConfig = any> =
    TestSuiteRaw<TestUserNames, ConnexionInfos, RestTestConfigType>
    | (() => MaybePromise<TestSuiteRaw<TestUserNames, ConnexionInfos, RestTestConfigType>>)

export type TestFunction<RestTestConfigType extends GreenDotApiTestsConfig> = (env: RestTestConfigType['env']) => void

export type TestElement<TestUserNames extends string, ConnexionInfos extends Record<string, any>, RestTestConfigType extends GreenDotApiTestsConfig> =
    Test<TestUserNames, ConnexionInfos, RestTestConfigType> |
    TestFn<RestTestConfigType['env'], void> |
    TestSuite<TestUserNames, ConnexionInfos, RestTestConfigType>


export type TestEnvBase = {
    users: Record<string, any>
} & Record<string, any>


export interface GreenDotApiTestsConfig<
    // ApiKeys extends string = any,
    // TestEnv extends TestEnvBase = any,
    // TestUserNames extends string = any,
    // ConnexionInfos extends Record<string, any> = any,
    // ApiKeysType extends Record<string, any> = any
    > {
    // TODO document jsdoc
    displayIntroTimeout: number
    mode: 'jsonRpc' | 'rest'
    disableSolo?: boolean
    apiKeys: GreenDotAppConfig['apiKeys']
    servers: {
        default: string // should be present, main server
        [serverNameShortcut: string]: string
    }
    env: ObjectGeneric
    startAtTestNb?: number
    afterTest?(testNb: number, env: ObjectGeneric)
    onError?(actualScenarioNb: number, env: ObjectGeneric)
    filter?: string
    isReload?: boolean
    restTestState?: Record<string, any>
    /** trigerred before the run */
    onBeforeAllTests?(conf: {
        isReload: boolean
        env: GD['testEnvType']
    }): any
    /** triggered BEFORE every tests */
    onBeforeTest?(conf: {
        env: GD['testEnvType'],
        as?: GD['testUserNames'],
        apiKey?: GD['apiKeys'],
        headers: Record<string, any>
    }): any
    /** triggered AFTER every tests */
    onAfterTest?(conf: {
        env: GD['testEnvType'],
        as?: GD['testUserNames'],
        apiKey?: GD['apiKeys'],
        headers: Record<string, any>
    }): any
}
