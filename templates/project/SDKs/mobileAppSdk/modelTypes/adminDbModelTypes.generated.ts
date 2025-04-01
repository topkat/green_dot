

export type FinanceConfig = {
    'plaidToken'?: string
    'lastTransactionCheckTimeStamp'?: number
    '_id': string
    'lastUpdateDate'?: Date
}

export type FinanceConfigWrite = {
    'plaidToken'?: string
    'lastTransactionCheckTimeStamp'?: number
    '_id'?: string
    'lastUpdateDate'?: Date
}

export interface FinanceConfigModels {
    Write: FinanceConfigWrite
    Read: FinanceConfig
}

export type AllModels = {
    financeConfig: FinanceConfigModels
}

export type ModelNames = keyof AllModels

