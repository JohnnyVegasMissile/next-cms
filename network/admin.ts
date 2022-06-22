import INSTANCE from './api'

export const uploadFile = (file: any): Promise<File> =>
    new Promise(async (resolve, reject) => {
        const data = new FormData()
        data.append('file', file)

        INSTANCE({
            method: 'POST',
            url: `/api/uploads`,
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
            url: `/api/uploads`,
        })
            .then(resolve)
            .catch(reject)
    })

export const deleteFiles = (filename: string): Promise<void> =>
    new Promise((resolve, reject) => {
        INSTANCE({
            method: 'DELETE',
            url: `/api/uploads`,
            data: {
                filename,
            },
        })
            .then(resolve)
            .catch(reject)
    })
