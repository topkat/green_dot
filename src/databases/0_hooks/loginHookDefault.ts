import { publicUserId } from '../../ctx'

export async function loginHookDefault(req): Promise<CtxUser> {
    return {
        _id: publicUserId,
        platform: req?.headers?.platform,
        role: 'public',
        permissions: {},
        authenticationMethod: [],
    }
}