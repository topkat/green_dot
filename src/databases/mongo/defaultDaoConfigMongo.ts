import { MongoDaoParsed } from './types/mongoDbTypes'

const defaultDaoConfigMongo: MongoDaoParsed<any> = {
    type: 'mongo',
    modelConfig: {},
    expose: [],
}
export default defaultDaoConfigMongo