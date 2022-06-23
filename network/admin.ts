import INSTANCE from './api'
import type { File } from '@prisma/client'

export const uploadFile = (file: any): Promise<File> =>
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

export const getFiles = (): Promise<File[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/images`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteFiles = (id: number): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/images/${id}`,
        })
            .then(resolve)
            .catch(reject)
    })

export const initPages = (): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/init`,
        })
            .then(resolve)
            .catch(reject)
    })

// await fetch('/api/pages', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(values),
// })

// await fetch(`/api/pages/${pid}`, {
//     method: 'PUT',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(values),
// })

// const res = await fetch('/api/pages')

// fetch(`/api/pages/${e.id}`, {
//     method: 'DELETE',
// })
