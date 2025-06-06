import { getMainConfig } from './getGreenDotConfigs.js'
import { error } from '../error.js'
import { parseStringAsBoolean } from 'topkat-utils'


type EnvType = {
  env: Env
  isProd: boolean
  isTest: boolean
}

export const env = new Proxy({} as EnvType, {
  get(o, p: keyof EnvType) {
    return getEnv(p)
  }
})

function getEnv(prop: keyof EnvType) {
  const mainConf = getMainConfig(true)

  if (prop === 'env') return (mainConf?.env || process.env.NODE_ENV) as Env
  else {

    const {
      isProdEnv = process.env.IS_PROD_ENV ? parseStringAsBoolean(process.env.IS_PROD_ENV) : undefined,
      isTestEnv = process.env.IS_TEST_ENV ? parseStringAsBoolean(process.env.IS_TEST_ENV) : undefined
    } = mainConf || {}

    if (typeof isProdEnv !== 'boolean') {
      throw error.serverError(`Env variable not found please report the issue`, {
        processEnvIsProd: process.env?.IS_PROD_ENV, processEnvIsTest: process.env?.IS_TEST_ENV, mainConfEnv: mainConf?.env
      })
    }
    return ({
      isProd: isProdEnv,
      isTest: isTestEnv
    } satisfies Omit<EnvType, 'env'>)[prop]
  }


}