
import { jest } from '@jest/globals'
import { newPublicCtx } from '../ctx.js'

jest.unstable_mockModule('../helpers/getGreenDotConfigs.js', () => ({
    getMainConfig: () => ({
        allPermissions: ['user', 'admin']
    })
}))



export type UserModels = {
    Write: User<string>
    Read: User<string>
    // WithoutGenerics: User<string>
    // WithoutGenericsWrite: User<string>
}

export type OrgModels = {
    Write: Organization<string[]>
    Read: Organization<string[]>
    // WithoutGenerics: Organization<string[]>
    // WithoutGenericsWrite: Organization<string[]>
}

export interface User<Org extends string | Organization<any>> {
    _id: string
    name: string,
    password: string,
    organization: Org
    // /!\ when adding fields here please add them to __mock__.models.validation
}

export interface Organization<Users extends string[] | User<any>[]> {
    _id: string
    name: string
    adminField1: string
    adminField2: string
    anotherFieldUserHaveNoAccess: string
    teams: { name: string, users: Users, adminAuth: string }[]
    // /!\ when adding fields here please add them to __mock__.models.validation
}


export function createUser<Org extends string | Organization<any> = string>(
    id: number,
    organization: Org
): User<Org> {
    return {
        _id: `USER_${id}`,
        name: `USER_${id}`,
        password: 'pass',
        organization,
    }
}

export function createOrg<Users extends string[] | User<any>[] = string[]>(
    id: number,
    users: Users = [] as Users
): Organization<Users> {
    return {
        _id: `ORG_${id}`,
        name: `ORG_${id}`,
        adminField1: 'af1',
        adminField2: 'af2',
        anotherFieldUserHaveNoAccess: 'af3',
        teams: users.map((_, i) => ({ name: `TEAM_${i + 1}`, users, adminAuth: 'secret' }))
    }
}


export const createUserId = <T extends number>(id: T): `USER_${T}` => `USER_${id}`
export const createOrgId = <T extends number>(id: T): `ORG_${T}` => `ORG_${id}`
export const createTeamId = <T extends number>(id: T): `TEAM_${T}` => `TEAM_${id}`

export const userId1 = createUserId(1)
export const userId2 = createUserId(2)
// export const userId3 = createUserId(3)

export const orgId1 = createOrgId(1)
// export const orgId2 = createOrgId(2)
// export const orgId3 = createOrgId(3)

//  const teamId1 = createTeamId(1)
//  const teamId2 = createTeamId(2)
//  const teamId3 = createTeamId(3)

type TestRoles = 'public' | 'admin' | 'user' | 'system'

export function getCtx(userRole: TestRoles = 'public', additionalFields = {}) {
    return { ...newPublicCtx().useRole(userRole as any), ...additionalFields } as any as Ctx
}