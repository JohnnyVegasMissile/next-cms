import { AuthResponse, ContextUser } from '../types'

import INSTANCE from './api'

export const signUp = (email: string, password: string, name?: string): Promise<AuthResponse> =>
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

export const signIn = (email: string, password: string): Promise<AuthResponse> =>
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

export const getMe = (): Promise<ContextUser> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/me`,
        })
            .then(resolve)
            .catch(reject)
    })
