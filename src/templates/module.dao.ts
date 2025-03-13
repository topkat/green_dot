

import { MongoDao } from 'green_dot'
import myNewModuleModel from './myNewModule.model'

const dao = {
    type: 'mongo',
    expose: [],
    filter: [],
    mask: [],
} satisfies MongoDao<typeof myNewModuleModel.tsType>

export default dao