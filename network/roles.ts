import { ObjectId } from '~/types'
import INSTANCE from './api'
import { Role } from '@prisma/client'
import RoleCreation from '~/types/roleCreation'

type RoleResponse = Role & {
    _count: {
        logins: number
    }
}

export const getRoles = (
    page: number,
    q: string,
    sort: `${string},${'asc' | 'desc'}` | undefined
): Promise<{
    results: RoleResponse[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/roles`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, sort },
    })

export const getRole = (id: ObjectId): Promise<RoleResponse> =>
    INSTANCE({
        method: 'GET',
        url: `/api/roles/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const postRole = (data: RoleCreation): Promise<RoleResponse> =>
    INSTANCE({
        method: 'POST',
        url: `/api/roles`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const updateRole = (id: ObjectId, data: RoleCreation): Promise<RoleResponse> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/roles/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
