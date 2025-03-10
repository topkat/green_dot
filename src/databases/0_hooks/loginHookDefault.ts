

import { serverConfig } from '../../cache/green_dot.app.config.cache'


export async function loginHookDefault(req): Promise<CtxUser> {
    const apiKey = req?.headers?.apikey
    const serverApiKeyConfig = Object.values(serverConfig.apiKeys).find(apiKeyConf => apiKeyConf.token === apiKey)
    const { role = 'public', _id = '000fffffffffffffffffffff' } = serverApiKeyConfig
    return {
        _id: _id, // public fake id (system is 777f+)
        platform: req?.headers?.platform,
        role: role,
        permissions: {},
        authenticationMethod: [],
    }
}