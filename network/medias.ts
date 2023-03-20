import { Media, MediaType } from '@prisma/client'
import INSTANCE from './api'
import { ObjectId } from '~/types'

export const getMedias = (
    page: number,
    q: string,
    sort: `${string},${'asc' | 'desc'}` | undefined,
    others: { type: MediaType | undefined }
): Promise<{
    results: (Media & {
        _count: {
            usedInSections: number
        }
    })[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/medias`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, sort, ...others },
    })

export const editImageAlt = (id: ObjectId, alt: string): Promise<Media> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/medias/${id}`,
        data: { alt },
    })

export const uploadMedia = (file: any): Promise<Media> => {
    const data = new FormData()
    data.append('file', file)

    return INSTANCE({
        method: 'POST',
        url: `/api/medias`,
        data,
    })
}

export const uploadFavicon = (file: any): Promise<Media> => {
    const data = new FormData()
    data.append('file', file)

    return INSTANCE({
        method: 'POST',
        url: `/api/medias/favicon`,
        headers: { 'Content-Type': 'application/json' },
        data,
    })
}
