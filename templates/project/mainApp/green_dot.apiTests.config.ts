
import { GreenDotApiTestsConfig, TestSuite as TestFlowRaw, TestItem as TestItemRaw } from 'green_dot'
import { appConfig } from './green_dot.app.config'
import { allRoutes } from './.generated/all-routes-for-tests.generated'


type TestUserNames = 'TODO import your userNames here'
type ConnexionInfos = { email: string, password: string }

export const restTestEnv = {
    routes: allRoutes,
}

/** Allow shorcut when testing on multiples servers */
export const servers = {
    default: appConfig.serverLiveUrl,
}

export const testConfig: GreenDotApiTestsConfig = {
    disableSolo: process.env.NODE_ENV === 'ci',
    mode: 'jsonRpc',
    servers,
    apiKeys: appConfig.apiKeys as any,
    env: restTestEnv,
    //----------------------------------------
    // BEFORE ALL TESTS
    //----------------------------------------
    async onBeforeAllTests({ env, isReload }) {

        // ALLOW TO SEE WITH WICH TOKEN WE ARE CONNECTED
        overrideBackendAuthorization(env)

        // TODO INIT SDKs here
    },
    //----------------------------------------
    // BEFORE / AFTER EACH TEST
    //----------------------------------------
    async onBeforeTest({ env, as, apiKey, headers }) {
        if (apiKey) {
            headers.apiKey = apiKey
        } else if (as) {
            if (typeof as === 'string') {
                // as === 'user1'
            } else if (typeof as === 'object') {
                // as === { email: 'my@email.com', password: 'Aazz' }
            }
        }
        // mySdk.setHeaders(headers)
        // while setAuthorization is just an alias of setHeaders, it is called because it triggers overrideBackendAuthorization
        // mySdk.setAuthorization(headers.authorization)
    },
    onAfterTest() {
        // RESET perms for SDK
        // mySdk.setHeaders({ apiKey: null, refreshToken: null, platform: null })
        // mySdk.setAuthorization(null)
    },
}

export type TestFlow<EnvFromUser> = TestFlowRaw<TestUserNames, ConnexionInfos, typeof testConfig & { env: typeof testConfig['env'] & typeof restTestEnv & EnvFromUser }>

export type TestItem<EnvFromUser> = TestItemRaw<TestUserNames, ConnexionInfos, typeof testConfig & { env: typeof testConfig['env'] & typeof restTestEnv & EnvFromUser }>





//----------------------------------------
// HELPERS
//----------------------------------------
/** Just a helper to log the userName/token we are connecting with */
function overrideBackendAuthorization(env: TestEnv) {
    const callbck = (authToken: string) => {

        let userThatWeAreConnectingWith: string
        if (env.users) Object.entries(env.users).find(([k, user]) => {
            if (user.accessToken === authToken) {
                userThatWeAreConnectingWith = k
                return true
            }
        })

        C.info(authToken === null ? 'UNLOG USER' : `LOGIN WITH: ` + (userThatWeAreConnectingWith || authToken || ' /!\\ NOT SET /!\\ '))
        // mySdk.setHeaders({ authorization: authToken })
    }
    // TODO replace connection function by this
    //  mySdk.setAuthorization = callbck
}






//----------------------------------------------------------
//
//            GLOBAL TYPES
//
// Those global types are exposed so you can override them
// with your custom functions or props
//----------------------------------------------------------

declare global {
    interface GD {
        testUserNames: TestUserNames
        // apiKeys: ApiKeys
        testEnvType: TestEnv
    }

    /** env variable type that is used in API tests ('.testFlow.ts' files). You can also override env type per test flow instead of globally in a type param (see generated file comments or documentation for advanced use cases TODO document me) */
    interface TestEnv {
        users: Record<string, any> // Record<UserNames, TestEnvUser>
    }
}