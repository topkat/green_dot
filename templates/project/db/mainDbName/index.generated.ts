
import userDao from './models/user.dao'
import userModel from './models/user.model'


export type NewsletterSubscriptions = typeof userModel.tsTypeRead
export type NewsletterSubscriptionsRead = typeof userModel.tsTypeRead
export type NewsletterSubscriptionsWrite = typeof userModel.tsTypeWrite


const models = {
  userModel,
}

const daos = {
  userDao,
}

export { models, daos }