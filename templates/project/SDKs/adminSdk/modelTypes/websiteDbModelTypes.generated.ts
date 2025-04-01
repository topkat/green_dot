

export type NewsletterSubscriptions = {
    'email': string
    'lang': string
    'currency'?: string
    'ipAddress'?: string
    'userAgent'?: string
    'lastBrevoSync'?: number
    '_id': string
    'creationDate': Date
}

export type NewsletterSubscriptionsWrite = {
    'email': string
    'lang': string
    'currency'?: string
    'ipAddress'?: string
    'userAgent'?: string
    'lastBrevoSync'?: number
    '_id'?: string
    'creationDate'?: Date
}

export interface NewsletterSubscriptionsModels {
    Write: NewsletterSubscriptionsWrite
    Read: NewsletterSubscriptions
}

export type AllModels = {
    newsletterSubscriptions: NewsletterSubscriptionsModels
}

export type ModelNames = keyof AllModels

