// /!\ IMPORTANT NOTICE /!\ dnt rmv the rmv as it's for generating types for frontend // rmv

import { _ } from 'good-cop' // rmv

export type RequestConfigShared = {
    disableEmittingEvents?: boolean // rmv
}

export type PopulateConfigObj<ModelType extends Record<string, any>> = {
    path: keyof ModelType,
    populate?: PopulateConfig<ModelType>[], // TODO it should be possible to get the type from populated field here
    select?: keyof ModelType
}
export type PopulateConfigWithoutStringSyntax<ModelType extends Record<string, any>> = {
    path: string,
    populate?: PopulateConfigObj<ModelType>[],
    select?: string
}
export type PopulateConfig<ModelType extends Record<string, any>> = keyof ModelType | PopulateConfigObj<ModelType>
export type SortConfig<ModelType extends Record<string, any>> = Partial<Record<keyof ModelType, 'asc' | 'desc'>>

/** EXPOSED means that all what is defined in those variables are allowed to use by the frontend. So no admin configuration should be present */ // rmv
const requestConfigPopulateValidatorEXPOSED = { populate: _.typesOr([_.string(), _.object()]) } // rmv
export type RequestConfigPopulate<ModelType extends Record<string, any>> = {
    populateAsAdmin?: boolean // rmv Should not be present in SDK
    populate?: PopulateConfig<ModelType>[]
}

// used to validate at runtime // rmv
export const requestConfigReadEXPOSED = { // rmv
    /** /!\ DO NOT PUT SENSITIVE FIELDS HERE (eg: populateAsAdmin), since it will be exposed and authorized to use in frontend */ // rmv
    ...requestConfigPopulateValidatorEXPOSED, // rmv
    filter: _.object(), // rmv
    page: _.number(), // rmv
    limit: _.number(), // rmv
    sort: _.object() // rmv
} // rmv
export type RequestConfigRead<ModelType extends Record<string, any>> = RequestConfigShared & RequestConfigPopulate<ModelType> & {
    filter?: AsFilter<ModelType>
    page?: number
    limit?: number
    sort?: { [k: string]: 1 | -1 }
}


export const requestConfigWrite = { // rmv
    ...requestConfigPopulateValidatorEXPOSED, // rmv
    returnDoc: _.boolean() // rmv
} // rmv
export type RequestConfigWrite<ModelType extends Record<string, any>> = RequestConfigShared & RequestConfigPopulate<ModelType> & {
    returnDoc?: boolean
}

export const requestConfigGetOne = { // rmv
    ...requestConfigReadEXPOSED, // rmv
    triggerErrorIfNotSet: _.boolean() // rmv
} // rmv
export type RequestConfigGetOne<ModelType extends Record<string, any>> = RequestConfigShared & RequestConfigRead<ModelType> & { triggerErrorIfNotSet?: boolean }


//----------------------------------------
// MONGO BODY
//----------------------------------------
type OnlyDotted<T> = {
    [K in keyof T]:
    K extends string
    ? T[K] extends object
    ? `${K}.${DottedKeys<T[K]>}`
    : never
    : never
}[keyof T]

type DottedKeys<T> = {
    [K in keyof T]:
    K extends string
    ? T[K] extends object
    ? K | `${K}.${DottedKeys<T[K]>}`
    : K
    : never
}[keyof T]


type ObjectWithDottedPaths<T extends Record<string, any>> = Partial<{
    [K in keyof T]:
    T[K] extends any[] ? T[K] // [number]
    : T[K] extends Record<string, any>
    ? ObjectWithDottedPaths<T[K]>
    : T[K]
} & { [key in OnlyDotted<T>]: any }>


export type AsMongooseBody<ModelDef extends Record<string, any>> = ObjectWithDottedPaths<ModelDef> & {
    $push?: {
        [K in keyof ObjectWithDottedPaths<ModelDef>]: ObjectWithDottedPaths<ModelDef>[K] extends any[] ? ObjectWithDottedPaths<ModelDef>[K][number] : never
    },
    $pull?: {
        [K in keyof ObjectWithDottedPaths<ModelDef>]: ObjectWithDottedPaths<ModelDef>[K] extends any[] ? ObjectWithDottedPaths<ModelDef>[K][number] : never
    },
    $inc?: {
        [K in keyof ObjectWithDottedPaths<ModelDef>]: ObjectWithDottedPaths<ModelDef>[K] extends number ? ObjectWithDottedPaths<ModelDef>[K][number] : never
    },
}

export type PaginationData = {
    total: number
    page: number
    limit: number
}

export type MaybePaginated<
    ReturnType extends Array<Record<string, any>>,
    Conf extends RequestConfigRead<any> = {}
> = Conf['page'] extends number ? PaginationData & { data: ReturnType } : ReturnType

//----------------------------------------
// MONGO FILTER
//----------------------------------------

// Do not refactor this type
type ObjectWithDottedPathsAndArrayAsValueForFilter<T extends Record<string, any>> = Partial<{
    [K in keyof T]:
    T[K] extends any[] ? MongoFilterValue<T[K][number]>
    : T[K] extends Date
    ? MongoFilterValue<T[K]>
    : T[K] extends Record<string, any>
    ? ObjectWithDottedPathsFilter<T[K]>
    : MongoFilterValue<T[K]>
} & { [key in OnlyDotted<T>]: any }>

type ObjectWithDottedPathsFilter<T extends Record<string, any>> = Partial<{
    [K in keyof T]:
    T[K] extends any[] ? MongoFilterValue<T[K]> // [number]
    : T[K] extends Date
    ? MongoFilterValue<T[K]>
    : T[K] extends Record<string, any>
    ? ObjectWithDottedPathsFilter<T[K]>
    : MongoFilterValue<T[K]>
} & { [key in OnlyDotted<T>]: any }>


type MongoFilterValue<V> = V
    | { $ne: V }
    | { $in: V[] }
    | (V extends number | Date ? ({ $gte: V } | { $lte: V } | { $gt: V } | { $lt: V }) : never)

type FilterObj<ModelDef extends Record<string, any>> = ObjectWithDottedPathsAndArrayAsValueForFilter<ModelDef>

export type AsFilter<ModelDef extends Record<string, any>> = FilterObj<ModelDef> & {
    $or?: FilterObj<ModelDef>[]
}