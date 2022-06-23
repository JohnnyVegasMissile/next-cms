import INSTANCE from './api'

export const uploadFile = (file: any): Promise<File> =>
    new Promise(async (resolve, reject) => {
        const data = new FormData()
        data.append('file', file)

        INSTANCE({
            method: 'POST',
            url: `/api/images/upload`,
            headers: { 'Content-Type': 'application/json' },
            data,
        })
            .then(resolve)
            .catch(reject)
    })

export const getFiles = (): Promise<string[]> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'GET',
            url: `/api/images`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteFiles = (filename: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/images`,
            data: {
                filename,
            },
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
