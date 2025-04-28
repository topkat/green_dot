
import { applyMaskIncludingOnPopulatedFieldsRecursive, applyMaskToPopulateConfig, combineMaskHooksAndReturnMaskOrSelectAddrArray, getMongoMaskForUser, getMaskFromSelect } from './maskService'
import { models } from '../../../tests/models'
import { appliableHooksForUser } from '../../0_hooks/appliableHookForUser'

import { getCtx, createUser, createOrg, orgId1 } from '../../../tests/jestHelpers'

import { nbOccurenceInString, C } from 'topkat-utils'

jest.mock('../../../helpers/getGreenDotConfigs', () => ({
    getMainConfig: () => ({
        allPermissions: ['user', 'admin']
    })
}))

jest.mock('../../../helpers/getProjectModelsAndDaos', () => ({
    getProjectDatabaseModels: () => models.validation,
    getProjectDatabaseDaosForModel: (dbName, modelName) => models.daos[dbName][modelName],
}))


describe('getMaskFromSelect', () => {
    it('COUCOU it je ne sais pas quoi mettre ici c est deja describe la haut j aime pas les test unitaires', async () => {
        const mask = await getMaskFromSelect(['adminField1', 'adminField2'], 'main', 'organization')
        expect(mask).toEqual([
            'name',
            'anotherFieldUserHaveNoAccess',
            'teams',
            'teams.users',
            'teams.name',
            'teams.adminAuth',
        ])
    })
})

describe('combineAndParseMaskHooks', () => {

    const userFields = Object.keys(createUser(1, 'ORG_1')).filter(f => f !== '_id')
    //----------------------------------------
    // PUBLIC
    //----------------------------------------
    it(`Single hooks, PUBLIC`, async () => {
        const hooks = await appliableHooksForUser(getCtx('public'), models.daos.main.user.mask, 'getOne', 'alwaysReturnFalse', 'alwaysReturnTrue')
        const { mask } = await combineMaskHooksAndReturnMaskOrSelectAddrArray(getCtx('public'), 'main', 'user', hooks, 'getOne')

        expect(mask).toEqual(userFields.filter(e => e !== 'name'))
        // it('select', () => expect(select).toEqual(['name']))
    })
    it(`Check CACHING works`, async () => {
        const hooks = await appliableHooksForUser(getCtx('public'), models.daos.main.user.mask, 'getOne', 'alwaysReturnFalse', 'alwaysReturnTrue')
        const { validUntil } = await combineMaskHooksAndReturnMaskOrSelectAddrArray(getCtx('public'), 'main', 'user', hooks, 'getOne') as any

        console.log(`validUntil`, validUntil)

        C.info('validUntil should be set so coming from CACHE')
        expect(validUntil).toBeDefined()
    })
    //----------------------------------------
    // ADMIN
    //----------------------------------------
    it(`single hooks, ADMIN, method:CREATE No hooks apply`, async () => {
        const hooks = await appliableHooksForUser(getCtx('admin'), models.daos.main.user.mask, 'create', 'alwaysReturnFalse', 'alwaysReturnTrue')
        const { mask } = await combineMaskHooksAndReturnMaskOrSelectAddrArray(getCtx('admin'), 'main', 'user', hooks, 'create')

        expect(mask).toEqual([])
        // it('select', () => expect(select).toEqual(userFields))// can create with a password
    })
    it(`single hooks, ADMIN, method:GETALL One hook apply`, async () => {
        const hooks = await appliableHooksForUser(getCtx('admin'), models.daos.main.user.mask, 'getAll', 'alwaysReturnFalse', 'alwaysReturnTrue')
        const { mask } = await combineMaskHooksAndReturnMaskOrSelectAddrArray(getCtx('admin'), 'main', 'user', hooks, 'getAll')

        expect(mask).toEqual(['password'])
        // it('select', () => expect(select).toEqual(userFields.filter(f => f !== 'password')))
    })
    //----------------------------------------
    // USER
    //----------------------------------------
    it(`multiple hook, user`, async () => {
        const hooks = await appliableHooksForUser(getCtx('user'), models.daos.main.organization.mask, 'getAll', 'alwaysReturnFalse', 'alwaysReturnTrue')
        const { mask } = await combineMaskHooksAndReturnMaskOrSelectAddrArray(getCtx('user'), 'main', 'organization', hooks, 'getAll')

        expect(mask).toEqual([
            'adminField1', // admin has been catched by * wildcard
            'adminField2',
            'teams[0].adminAuth' // adminAuth is masked AND selected so it should not be allowed
        ])
    })
})

describe(`transformMaskToSelectMongo`, () => {
    it('no hook apply so allAllowed is true', async () => {
        const maskArr = await getMongoMaskForUser(getCtx('admin'), 'create', 'main', 'user')
        expect(maskArr.length).toEqual(0)
    })

    it('User getall org', async () => {
        const maskArr = await getMongoMaskForUser(getCtx('user'), 'getAll', 'main', 'organization')
        // same as above WITHOUT ARRAY SYNTAX
        expect(maskArr).toEqual(['-adminField1', '-adminField2', '-teams.adminAuth'])
    })
})

test('applyMaskOnPopulatedFieldsRecursive', async () => {

    const org = createOrg(1, ['USER_1', 'USER_2'])

    const newFields = await applyMaskIncludingOnPopulatedFieldsRecursive(getCtx('user'), 'create', 'main', 'organization', org, false)

    const user1 = createUser(1, orgId1)
    const user2 = createUser(2, orgId1)
    const maskedUser1 = { ...user1 }
    const maskedUser2 = { ...user2 }
    delete maskedUser1.password
    delete maskedUser2.password

    const maskedOrg = (populate = false) => ({
        _id: 'ORG_1',
        name: 'ORG_1',
        anotherFieldUserHaveNoAccess: 'af3',
        // other first level admin fields masked
        teams: [
            // admin field in teams masked
            { name: 'TEAM_1', users: populate ? [maskedUser1, maskedUser2] : ['USER_1', 'USER_2'] },
            { name: 'TEAM_2', users: populate ? [maskedUser1, maskedUser2] : ['USER_1', 'USER_2'] },
        ],
    })

    C.info('check org fields has been correctly masked on all levels')
    expect(newFields).toEqual(maskedOrg())

    const user = createUser(1, createOrg(1, [user1, user2]))

    const newUser = await applyMaskIncludingOnPopulatedFieldsRecursive(getCtx('user'), 'getAll', 'main', 'user', user)

    C.info('First Level Password should not be set for user')
    expect(newUser.password).toBeUndefined()

    C.info('org should be masked althougt it was populated, and PASSWORD should not appear even if nested in the 3rd level and array of populated field')
    expect(newUser.organization).toEqual(maskedOrg(true))

})

describe('applyMaskToPopulateConfig on Populate config 4 LEVEL DEEP', () => {
    const popConfigIn = [{
        path: 'organization', populate: [
            {
                path: 'teams.users', populate: [{
                    path: 'organization', populate: [{ path: 'teams.users', select: 'password name' }]
                }]
            }
        ]
    }] // 4 level deep populate


    it(`No hook apply`, async () => {
        const popConfigOutAdminNoHookApply = await applyMaskToPopulateConfig(getCtx('admin'), popConfigIn, 'main', 'user', 'create')

        expect(popConfigOutAdminNoHookApply).toEqual(popConfigIn)
    })

    it(`One hook apply for user`, async () => {
        const popConfigOutAdminOneHookApply = await applyMaskToPopulateConfig(getCtx('admin'), popConfigIn, 'main', 'user', 'getAll')

        expect(nbOccurenceInString(JSON.stringify(popConfigOutAdminOneHookApply), '"select":"-password')).toEqual(2)
    })

    it(`3 hooks apply (1 user and 2 org)`, async () => {
        const popConfigOutUser = await applyMaskToPopulateConfig(getCtx('user'), popConfigIn, 'main', 'user', 'getAll')

        expect(nbOccurenceInString(JSON.stringify(popConfigOutUser), '"select":"-password')).toEqual(2)
        expect(nbOccurenceInString(JSON.stringify(popConfigOutUser), '"select":"-adminField1 -adminField2 -teams.adminAuth"')).toEqual(2)
        expect(nbOccurenceInString(JSON.stringify(popConfigOutUser), '"select"')).toEqual(4)
    })
})