import INSTANCE from './api'
import { Prisma } from '@prisma/client'
import type { Article, Role } from '@prisma/client'

import { FullArticle, FullArticleEdit } from '../types'

export const postRole = (data: Prisma.RoleCreateInput): Promise<Role> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/users/types`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const editRole = (id: string, data: Prisma.RoleCreateInput): Promise<Role> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/users/types/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getRoles = (q?: string): Promise<Role[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/users/types`,
            params: { q },
        })
            .then(resolve)
            .catch(reject)
    })

export const getRoleDetails = (id: string): Promise<Role> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/users/types/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteRole = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/users/types/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
