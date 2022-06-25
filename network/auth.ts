import { User } from '@prisma/client'

import INSTANCE from './api'

interface AuthResponse {
    user: User
}

export const signUp = (
    email: string,
    password: string,
    name?: string
): Promise<AuthResponse> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/auth/signup`,
            data: {
                email,
                password,
                name,
            },
        })
            .then(resolve)
            .catch(reject)
    })

export const signIn = (
    email: string,
    password: string
): Promise<AuthResponse> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/auth/signin`,
            data: {
                email,
                password,
            },
        })
            .then(resolve)
            .catch(reject)
    })
