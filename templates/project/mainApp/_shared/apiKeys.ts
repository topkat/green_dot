

import { GreenDotAppConfig, env } from 'green_dot'


const productionApiKeys = {
  // TODO configure your production apiKeys here
} satisfies GreenDotAppConfig['apiKeys']

const testApiKeys = {
  // TODO configure your test apiKeys here (they are not leaked to production)
} satisfies GreenDotAppConfig['apiKeys']

export type ApiKeys = keyof typeof productionApiKeys



export function getApiKeys(): GreenDotAppConfig['apiKeys'] {
  if (env.isProd) return productionApiKeys
  else return { ...productionApiKeys, ...testApiKeys }
}