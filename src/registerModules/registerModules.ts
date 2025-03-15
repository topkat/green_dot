
import { registerServiceApi } from './registerServicesApi'
import { throwError } from '../core.error'
import { registerDaoApi } from './registerDaoApi'
import { registerServices } from './registerServices'
import { registerModels } from './registerModels'

export async function registerModules(
    app,
    isPrimaryCluster = true
) {
    try {
        // REGISTER MODELS
        await registerModels()

        // REGISTER DAO API
        await registerDaoApi(app)

        // REGISTER SERVICES
        const allRoutesFromServices = await registerServices(isPrimaryCluster)

        // REGISTER SERVICE API
        await registerServiceApi(app, allRoutesFromServices)

    } catch (err) {
        throwError.serverError(null, 'Error while registering modules', { err })
    }
}
