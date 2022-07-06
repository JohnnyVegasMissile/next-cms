import INSTANCE from './api'
import { Prisma } from '@prisma/client'
import type { Page } from '@prisma/client'
import { FullPageEdit, PageTypes } from '../types'

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

export const editPage = (
    id: string | number,
    data: Prisma.PageCreateInput
): Promise<Page> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/pages/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getPages = (type?: PageTypes): Promise<Page[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/pages`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { type },
        })
            .then(resolve)
            .catch(reject)
    })

export const deletePage = (id: string | number): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/pages/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const getPageDetails = (id: number | string): Promise<FullPageEdit> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/pages/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
