import INSTANCE from './api'
import type { Media } from '@prisma/client'

export const uploadMedia = (file: any): Promise<Media> =>
    new Promise(async (resolve, reject) => {
        const data = new FormData()
        data.append('file', file)

        INSTANCE({
            method: 'POST',
            url: `/api/medias`,
            headers: { 'Content-Type': 'application/json' },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const uploadFavicon = (file: any): Promise<Media> =>
    new Promise(async (resolve, reject) => {
        const data = new FormData()
        data.append('file', file)

        INSTANCE({
            method: 'POST',
            url: `/api/medias/favicon`,
            headers: { 'Content-Type': 'application/json' },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getMedias = (type?: string, q?: string): Promise<Media[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/medias`,
            params: { type, q },
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteMedia = (id: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/medias/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const editImageAlt = (id: string, alt: string): Promise<Media> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/medias/${id}`,
            data: { alt },
        })
            .then(resolve)
            .catch(reject)
    })

export const getMediaDetail = (id: string): Promise<Media> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/medias/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
