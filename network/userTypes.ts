import INSTANCE from './api'
import { Prisma } from '@prisma/client'
import type { Article, UserType } from '@prisma/client'

import { FullArticle, FullArticleEdit } from '../types'

export const postUserType = (data: Prisma.UserTypeCreateInput): Promise<UserType> =>
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

export const editUserType = (
    id: string,
    data: Prisma.UserTypeCreateInput
): Promise<UserType> =>
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

export const getUserTypes = (q?: string): Promise<UserType[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/users/types`,
            params: { q },
        })
            .then(resolve)
            .catch(reject)
    })

export const getUserTypeDetails = (id: string): Promise<UserType> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/users/types/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteUserType = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/users/types/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
