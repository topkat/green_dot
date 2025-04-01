


import { core$, makeApiCall, error } from 'green_dot'
import { models as bangkModels } from 'bangk-db'
import { getDb } from '@bangk/app-config-shared'

export const $ = {
  ...core$,
  models: {
    bangk: bangkModels,
  },
  db: getDb(),
  env: process.env.NODE_ENV,
  // overrides with local files and types
  throw: error,
  isTestEnv() {
    return process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'ci'
  },
  isProdEnv() {
    return process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'preprod'
  },
  makeApiCall,
}

export const db = $.db.bangk

export default $