
import newsletterSubscriptionsDao from './models/user.dao'
import newsletterSubscriptionsModel from './models/user.model'


export type NewsletterSubscriptions = typeof newsletterSubscriptionsModel.tsTypeRead
export type NewsletterSubscriptionsRead = typeof newsletterSubscriptionsModel.tsTypeRead
export type NewsletterSubscriptionsWrite = typeof newsletterSubscriptionsModel.tsTypeWrite


const models = {
  newsletterSubscriptionsModel,
}

const daos = {
  newsletterSubscriptionsDao,
}

export { models, daos }