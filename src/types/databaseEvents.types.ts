

import type { ModelsWithReadWrite } from '../cache/dbs/index.generated.js'
import { CreateEventAfterCtx, CreateEventBeforeCtx, DeleteEventCtx, GetAllEventAfterCtx, GetAllEventBeforeCtx, GetOneEventAfterCtx, GetOneEventBeforeCtx, UpdateEventCtx } from './core.types.js'


type CreateBefore = {
  [K in keyof ModelsWithReadWrite as `${K}.create.before`]: [CreateEventBeforeCtx<ModelsWithReadWrite[K]>]
}

type CreateAfter = {
  [K in keyof ModelsWithReadWrite as `${K}.create.after`]: [CreateEventAfterCtx<ModelsWithReadWrite[K]>]
}

type UpdateEvent = {
  [K in keyof ModelsWithReadWrite as `${K}.update.${'before' | 'after'}`]: [UpdateEventCtx<ModelsWithReadWrite[K]>]
}

type GetOneBefore = {
  [K in keyof ModelsWithReadWrite as `${K}.getOne.before`]: [GetOneEventBeforeCtx]
}

type GetOneAfter = {
  [K in keyof ModelsWithReadWrite as `${K}.getOne.after`]: [GetOneEventAfterCtx<ModelsWithReadWrite[K]>]
}

type GetAllBefore = {
  [K in keyof ModelsWithReadWrite as `${K}.getAll.before`]: [GetAllEventBeforeCtx]
}

type GetAllAfter = {
  [K in keyof ModelsWithReadWrite as `${K}.getAll.after`]: [GetAllEventAfterCtx<ModelsWithReadWrite[K]>]
}

type DeleteEvent = {
  [K in keyof ModelsWithReadWrite as `${K}.delete.${'before' | 'after'}`]: [DeleteEventCtx]
}


declare global {
  interface GDeventNames extends CreateBefore, CreateAfter, UpdateEvent, GetOneBefore, GetOneAfter, GetAllBefore, GetAllAfter, DeleteEvent { }
}