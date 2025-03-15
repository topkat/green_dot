import { getMainConfig } from './getGreenDotConfigs'



export const env = new Proxy({} as ReturnType<typeof getEnv>, {
  get(o, p) {
    return getEnv()[p]
  }
})

function getEnv() {
  const { env, isProdEnv, isTestEnv } = getMainConfig()
  return {
    env: env as Env, isProd: isProdEnv, isTest: isTestEnv
  }
}