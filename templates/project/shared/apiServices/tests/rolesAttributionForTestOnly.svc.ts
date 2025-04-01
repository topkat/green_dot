
import { svc, _, db } from 'green_dot'
import { allPermissions } from '../../constants'

const rolesToAddSchema = _.object(
    allPermissions.reduce((acc, key) => {
        acc[key] = _.boolean().optional()
        return acc
    }, {})
)

export const rolesAttributionForTestOnly = svc({
    for: ['ALL', 'public'],
    input: {
        rolesToAdd: rolesToAddSchema,
        userId: _.string()
    },
    output: _.model('bangk', 'user'),
    forEnv: ['test'],
    async main(ctx, { rolesToAdd, userId }) {
        const user = await db.user.update(ctx.GM, userId, rolesToAdd, { returnDoc: true })
        return user
    },
})