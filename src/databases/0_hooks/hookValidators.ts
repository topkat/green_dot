


import { daoMethodsWithReadWrite } from '../../types/core.types.js'
import { DaoHookNamesMongo, MongoDao } from '../mongo/types/mongoDbTypes.js'

export const hookValidators: Record<DaoHookNamesMongo, HookValidator> = {
    //----------------------------------------
    // GENERICS
    //----------------------------------------
    expose: {
        validate: hook => {
            return Array.isArray(hook.expose) && hook.expose.every(method => daoMethodsWithReadWrite.includes(method))
        },
        errMsg: `Check expose hook is an array an contains only values in ${daoMethodsWithReadWrite.join(', ')}`
    },
    mask: {
        validate: (hook: MongoDao<any>['mask'][number]) => {
            return typeof hook.mask === 'function' || typeof hook.select === 'function'
        },
        errMsg: `Check mask hook .mask OR .select is a function`
    },
    //----------------------------------------
    // MONGO
    //----------------------------------------
    filter: {
        validate: (hook: MongoDao<any>['filter'][number]) => {
            return typeof hook.filter === 'function'
        },
        errMsg: `TODO`
    },

}

export type HookValidator = {
    validate(hook): boolean
    errMsg?: string
}
