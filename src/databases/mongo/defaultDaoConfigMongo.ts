import { MongoDaoParsed } from './types/mongoDbTypes.js'

const defaultDaoConfigMongo: MongoDaoParsed<any> = {
    type: 'mongo',
    modelConfig: {},
    expose: [],
}
export default defaultDaoConfigMongo