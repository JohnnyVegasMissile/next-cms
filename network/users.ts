import INSTANCE from './api'
import { Prisma } from '@prisma/client'
import type { User, Login } from '@prisma/client'
import { FullUser } from '../types'

export const postUser = (data: Prisma.UserCreateInput): Promise<FullUser> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/users`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const editUser = (id: number | string, data: any): Promise<FullUser> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/users/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getUsers = (): Promise<FullUser[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/users`,
        })
            .then(resolve)
            .catch(reject)
    })

export const getUser = (id: number | string): Promise<FullUser> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/users/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteUser = (id: number | string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/users/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
