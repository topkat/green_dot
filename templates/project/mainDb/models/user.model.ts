
import { _, InferType, InferTypeWrite, UserAdditionalFieldsRead, UserAdditionalFieldsWrite } from 'green_dot'

const model = _.mongoModel(['creationDate', 'lastUpdateDate'], {
  // NOTE: user has already some base fields implemented by green_dot
  // you can import the type UserAdditionalFields or get the fields
  // at runtime with getUserAdditionalFields()
})

export default model

export type User = InferType<typeof model> & UserAdditionalFieldsRead
// type may differ when writing (create / update) vs reading
export type UserWrite = InferTypeWrite<typeof model> & UserAdditionalFieldsWrite