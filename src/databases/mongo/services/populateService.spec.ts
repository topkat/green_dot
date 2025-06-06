import { unPopulate, forEachPopulateFieldRecursive } from './populateService'
import { createUser, createOrg, userId1, userId2, orgId1 } from '../../../tests/jestHelpers'
import { models } from '../../../tests/models'

import { C } from 'topkat-utils'


jest.mock('../../../helpers/getGreenDotConfigs', () => ({
    getMainConfig: () => ({
        allPermissions: ['user', 'admin']
    })
}))


jest.mock('../../../helpers/getProjectModelsAndDaos', () => ({
    getProjectDatabaseModels: () => models.validation,
    getProjectDatabaseDaosForModel: (dbName, modelName) => models.daos[dbName][modelName],
}))

describe('populateService', () => {
    describe('unPopulate', () => {
        it('should replace populated fields with their IDs', async () => {
            const fields = createUser(1, createOrg(1, [userId1, userId2]))
            const fieldsUnpopulated = createUser(1, orgId1)

            await unPopulate('mainDb', 'user', fields)

            expect(fields).toEqual(fieldsUnpopulated)
        })
        it('Same but with ARRAY fields', async () => {
            const fields = createOrg(1, [createUser(1, orgId1), createUser(2, orgId1)])
            const fieldsUnpopulated = createOrg(1, [userId1, userId2])

            await unPopulate('mainDb', 'organization', fields)

            expect(fields).toEqual(fieldsUnpopulated)
        })
    })
    it('forEachPopulateField', async () => { // /!\ One big it because https://github.com/jestjs/jest/issues/2235 shit
        // it('should call the callback for each populated field', () => {
        // this create a user populated by org populated by teams.users populated by org 🤪
        const user = createUser(1, createOrg(1, [createUser(2, createOrg(3, ['mostNestedStructureEver'])), createUser(3, orgId1)]))

        const callbackParamArr = [] as any[]
        const callback = (...params) => callbackParamArr.push(params)

        await forEachPopulateFieldRecursive('mainDb', 'user', user, callback)

        C.info('Callback should have been called 6 times')
        expect(callbackParamArr.length).toEqual(6)

        C.info('Run 1')
        expect(callbackParamArr[0]).toEqual([
            user.organization, // fieldValue
            'organization', // addrInParent
            user, // parent
            'organization', // modelName
            'organization' // addr from root
        ])
        C.info('Run 2')
        expect(callbackParamArr[1]).toEqual([
            user.organization.teams[0].users[0],
            0,
            user.organization.teams[0].users,
            'user',
            'teams[0].users[0]'
        ])
        C.info('Run 3')
        expect(callbackParamArr[2]).toEqual([
            user.organization.teams[0].users[0].organization, // ORG_3
            'organization',
            user.organization.teams[0].users[0],
            'organization',
            'organization'
        ])

        C.info('Run 4')
        expect(callbackParamArr[3]).toEqual([
            'mostNestedStructureEver',
            0,
            (user.organization.teams[0].users[0].organization as any).teams[0].users, // ORG_3
            'user',
            'teams[0].users[0]',
        ])
        // SECOND TEAM
        C.info('Run 5')
        expect(callbackParamArr[4]).toEqual([
            user.organization.teams[0].users[1],
            1,
            user.organization.teams[0].users,
            'user',
            'teams[0].users[1]'
        ])
        C.info('Run 6')
        expect(callbackParamArr[5]).toEqual([
            orgId1,
            'organization',
            user.organization.teams[0].users[1],
            'organization',
            'organization'
        ])
    })
})