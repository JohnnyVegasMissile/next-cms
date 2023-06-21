import { ObjectId } from '~/types'
import INSTANCE from './api'
import { Role, User } from '@prisma/client'
import UserCreation from '~/types/userCreation'

type UserResponse = User & {
    login: {
        role: Role | null
        email: string
    } | null
}

export const getUsers = (
    page: number,
    q: string,
    sort: `${string},${'asc' | 'desc'}` | undefined
): Promise<{
    results: UserResponse[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/users`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, sort },
    })

export const postUser = (data: UserCreation): Promise<User> =>
    INSTANCE({
        method: 'POST',
        url: `/api/users`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const updateUser = (id: ObjectId, data: UserCreation): Promise<User> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/users/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
