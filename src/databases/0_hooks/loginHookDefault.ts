import { getActiveAppConfig } from '../../helpers/getGreenDotConfigs'


export async function loginHookDefault(req): Promise<CtxUser> {

    const appConfig = await getActiveAppConfig()

    const apiKey = req?.headers?.apikey
    const serverApiKeyConfig = Object.values(appConfig.apiKeys).find(apiKeyConf => apiKeyConf.token === apiKey)
    const { role = 'public', _id = '000fffffffffffffffffffff' } = serverApiKeyConfig
    return {
        _id: _id, // public fake id (system is 777f+)
        platform: req?.headers?.platform,
        role: role,
        permissions: {},
        authenticationMethod: [],
    }
}