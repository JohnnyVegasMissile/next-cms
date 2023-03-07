import { Media } from '@prisma/client'
import INSTANCE from './api'

export const uploadMedia = (file: any): Promise<Media> => {
    const data = new FormData()
    data.append('file', file)

    return INSTANCE({
        method: 'POST',
        url: `/api/medias`,
        headers: { 'Content-Type': 'application/json' },
        data,
    })
}

export const uploadFavicon = (file: any): Promise<Media> =>
    new Promise(async (resolve, reject) => {
        const data = new FormData()
        data.append('file', file)

        return INSTANCE({
            method: 'POST',
            url: `/api/medias/favicon`,
            headers: { 'Content-Type': 'application/json' },
            data,
        })
    })
