import INSTANCE from './api'
import { Prisma } from '@prisma/client'
import type { Page } from '@prisma/client'

export const postPage = (data: Prisma.PageCreateInput): Promise<Page> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/pages`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const editPage = (id: number): Promise<Page> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/pages/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(resolve)
            .catch(reject)
    })

export const getPages = (): Promise<Page[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/pages`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deletePage = (id: number): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/pages/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
