

import { MongoDao } from 'shared/green_dot'
import { AllModels } from 'bangk-db'

const dao = {
    type: 'mongo',
    expose: [],
    filter: [],
    mask: [],
} satisfies MongoDao<AllModels['myNewModule']>

export default dao