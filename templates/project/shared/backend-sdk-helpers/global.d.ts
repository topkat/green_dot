
type ObjectId = string

type Env = 'test' | 'development' | 'production' | 'preprod' | 'build' | 'ci'

type MaybeArray<T> = T | T[]
type MaybePromise<T> = T | Promise<T>

type FunctionGeneric = (...params: any[]) => any
type ObjectGeneric = { [k: string]: any }

type ObjectWithNoFn = { [name: string]: NotFunction<any> }

// eslint-disable-next-line @typescript-eslint/ban-types
type NotFunction<T> = T extends Function ? never : T

type AsType<T, Type> = T extends Type ? T : Type

type AsString<T> = AsType<T, string>

type Complete<T> = {
  [P in keyof Required<T>]: T[P];
}

type CountryCodeIso = `${Letters}${Letters}`
type TranslationObj = { [countryIsoCode in CountryCodeIso]?: string }

type Override<T1, T2> = Omit<T1, keyof T2> & T2

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? RecursivePartial<U>[]
  : T[P] extends object
  ? RecursivePartial<T[P]>
  : T[P];
}

type Letters = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

type SimpleNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

type ArrayOneOrMore<T> = { 0: T } & Array<T>

type RecursiveObjValueType<T, Type> = {
  [K in keyof T]?: T[K] extends object
  ? Type | RecursiveObjValueType<T[K], Type>
  : Type;
}

type TypeObjectValues<Obj extends Record<string, any>, Type> = {
  [K in keyof Obj]: Type;
}

// https://stackoverflow.com/questions/49580725/is-it-possible-to-restrict-typescript-object-to-contain-only-properties-defined
type NoExtraProperties<T, U extends T = T> = U &
  MakeObjKeysAsNever<Exclude<keyof U, keyof T>>
type MakeObjKeysAsNever<K extends keyof any> = { [P in K]: never }

type RemoveTypeFromTuple<T, TypeToRemove> = T extends []
  ? []
  : T extends TypeToRemove
  ? []
  : T extends [infer A, ...infer R]
  ? [
    ...RemoveTypeFromTuple<A, TypeToRemove>,
    ...RemoveTypeFromTuple<R, TypeToRemove>
  ]
  : [T]

type GetTypeKeyFromObject<ObjType, Type> = {
  [P in keyof ObjType]: ObjType[P] extends Type ? never : P;
}[keyof ObjType]

/** Remove object key/values that are of a certain type */
type RemoveTypeFromObj<ObjType, Type> = Pick<
  ObjType,
  GetTypeKeyFromObject<ObjType, Type>
>

type StringKeys<T> = keyof T extends infer K
  ? K extends string
  ? K
  : never
  : never

type HasPropertyOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? true : never;
}[keyof T] extends never
  ? false
  : true

/** Get keys where the key type (number, string, Symbol...) is of Type */
type GetObjectKeysThatAreOfType<ObjType, Type> = {
  [P in keyof ObjType]: P extends Type ? P : never
}[keyof ObjType]

/** Remove Symbol and number from Object type */
type ForceStringKeyObject<Obj extends Record<any, any>> = Pick<
  Obj,
  GetObjectKeysThatAreOfType<Obj, string>
>


/** Get all indices of an array as a type. Eg: 0 | 1 | 2... */
type Indices<T extends readonly any[]> = Exclude<
  Partial<T>['length'],
  T['length']
>

/** Remove Readonly Modifier */
type Writeable<T> = { -readonly [P in keyof T]: T[P] }
/** Remove Readonly Modifier Recursively */
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

type GenericFunction = (...params: any[]) => any

type IsObject<T> = T extends Record<string, any>
  ? T extends GenericFunction
  ? false
  : true
  : false

type ReadonlyDeep<T> = {
  readonly [P in keyof T]: IsObject<T[P]> extends true
  ? ReadonlyDeep<T[P]>
  : T[P];
}

/** Equivalent of { myPropA: string, otherProp?: never } | { myPropA?: never, otherProp: string }. This would be written Exclusive<{ myPropA: string },  {  otherProp: string }> */
type Exclusive<
  A extends Record<string, any>,
  B extends Record<string, any>,
  C extends Record<string, any> = {},
  D extends Record<string, any> = {},
  E extends Record<string, any> = {}
> =
  | ({
    [P in Exclude<keyof A | keyof C | keyof D | keyof E, keyof B>]?: never;
  } & B)
  | ({
    [P in Exclude<keyof B | keyof C | keyof D | keyof E, keyof A>]?: never;
  } & A)
  | ({
    [P in Exclude<keyof B | keyof A | keyof D | keyof E, keyof C>]?: never;
  } & C)
  | ({
    [P in Exclude<keyof B | keyof A | keyof C | keyof E, keyof D>]?: never;
  } & D)
  | ({
    [P in Exclude<keyof B | keyof A | keyof C | keyof D, keyof E>]?: never;
  } & E)

type WeekDays = 0 | 1 | 2 | 3 | 4 | 5 | 6

type StringAndUnion<T> = T | (string & {})

type ArrayKeys<Arr extends any[] | readonly any[]> = keyof Arr & number

