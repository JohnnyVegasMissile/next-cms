import INSTANCE from './api'
import type { Media } from '@prisma/client'

export const uploadImage = (file: any): Promise<Media> =>
    new Promise(async (resolve, reject) => {
        const data = new FormData()
        data.append('file', file)

        INSTANCE({
            method: 'POST',
            url: `/api/images`,
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
            url: `/api/images/favicon`,
            headers: { 'Content-Type': 'application/json' },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getImages = (): Promise<Media[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/images`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteImage = (id: string | number): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/images/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const editImage = (id: number | string, alt: string): Promise<Media> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'PUT',
            url: `/api/images/${id}`,
            data: { alt },
        })
            .then(resolve)
            .catch(reject)
    })

export const getImageDetail = (id: number | string): Promise<Media> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/images/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })
