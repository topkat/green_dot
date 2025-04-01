
export * as AdminDbModels from './modelTypes/adminDbModelTypes.generated'
export * from './modelTypes/adminDbModelTypes.generated'
import { AllModels as AdminDbAllModels, ModelNames as AdminDbModelNames } from './modelTypes/adminDbModelTypes.generated'

export * as BangkDbModels from './modelTypes/bangkDbModelTypes.generated'
export * from './modelTypes/bangkDbModelTypes.generated'
import { AllModels as BangkDbAllModels, ModelNames as BangkDbModelNames } from './modelTypes/bangkDbModelTypes.generated'

export * as WebsiteDbModels from './modelTypes/websiteDbModelTypes.generated'
export * from './modelTypes/websiteDbModelTypes.generated'
import { AllModels as WebsiteDbAllModels, ModelNames as WebsiteDbModelNames } from './modelTypes/websiteDbModelTypes.generated'

export type AllModels = AdminDbAllModels & BangkDbAllModels & WebsiteDbAllModels
export type ModelNames = AdminDbModelNames | BangkDbModelNames | WebsiteDbModelNames
