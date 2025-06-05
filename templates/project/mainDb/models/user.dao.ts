/** USER DAO
This files is the security configuration file for your model

VSCode / Cursor Users
=> begin typing gd_dao to select from a snippet
list to expand to configure dao entries
=> Hover over a dao prop to see its documentation

This file allow masking, filtering, populating and exposing via api (and in SDK)
any of your model functions (create, update, getOne, getAll, getById, count, delete...)

It works by putting together config bricks like:
@example ```ts
{
  // List of roles configs to which the config will apply to
  for: [
    'myRole1',
    'user',
    { role:'user', myCustomPerm: true }
  ],
  // this is a list of method the config will apply to
  on: ['update', 'getAll'],
}

Note: in case multiple config bricks refers the same user at runtime, they will be merged
so that the strictest combination apply.
Examples:
* if one brick mask 'password' and the other one mask 'accountNb', both fields will be masked
* if one brick mask 'password' and another rule select (opposite of mask) 'ALL' password field will be masked

```
*/

import { MongoDao, UserAdditionalFieldsRead } from 'green_dot'
import { User } from './user.model'

const dao = {
    type: 'mongo',
    modelConfig: {},
    expose: [
        // type gd_dao:expose for snippet autocompletion
    ],
    filter: [
        // type gd_dao:filter to expand snippet
    ],
    mask: [
        // type gd_dao:mask to expand snippet
    ],
    populate: [],
} satisfies MongoDao<User>

export default dao