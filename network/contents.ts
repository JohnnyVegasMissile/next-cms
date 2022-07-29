import INSTANCE from './api'
import { Content, Prisma } from '@prisma/client'

export const postContent = (data: Prisma.ContentCreateInput | any): Promise<Content> =>
    new Promise(async (resolve, reject) => {
        INSTANCE({
            method: 'POST',
            url: `/api/contents`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const editContent = (id: string, data: Prisma.ContentCreateInput | any): Promise<Content> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/contents/${id}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getContents = (container?: string, q?: string): Promise<Content[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/contents`,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { q, container },
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteContent = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/contents/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const getContentDetails = (id: string): Promise<any> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/contents/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
