import { getMainConfig } from './getGreenDotConfigs'
import { error } from '../error'



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
  if (!mainConf && prop !== 'env') {
    throw error.serverError(`Do not use env.isProd or env.isTest straight in the body of your ts files since server needs to start to evaluate those variables correctly. If you really need to, you have to create and use a local version.`)
  }
  const {
    env = process.env.NODE_ENV,
    isProdEnv,
    isTestEnv
  } = mainConf || {}
  return ({
    env: env as Env,
    isProd: isProdEnv,
    isTest: isTestEnv
  } satisfies EnvType)[prop]
}