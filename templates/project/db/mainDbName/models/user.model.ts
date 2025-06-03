
import { _ } from 'green_dot'

const model = _.mongoModel(['creationDate', 'lastUpdateDate'], {
  // NOTE: user has already some base fields implemented by green_dot
  // you can import the type UserAdditionalFields or get the fields
  // at runtime with getUserAdditionalFields()
})

export default model