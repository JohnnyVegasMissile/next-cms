import PageCreation from '~/types/pageCreation'
import INSTANCE from './api'
import { Metadata, Page, PageType, Slug } from '@prisma/client'
import { ObjectId } from '~/types'

type PageResponse = Page & {
    slug: Slug | null
    metadatas: Metadata[]
}

export const getPages = (
    page: number,
    q: string,
    type: PageType | undefined,
    sort: `${string},${'asc' | 'desc'}` | undefined
): Promise<{
    pages: PageResponse[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/pages`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, type, sort },
    })

export const getPage = (id: ObjectId): Promise<PageResponse> =>
    INSTANCE({
        method: 'GET',
        url: `/api/pages/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const postPages = (data: PageCreation): Promise<PageResponse> =>
    INSTANCE({
        method: 'POST',
        url: `/api/pages`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const updatePages = (id: ObjectId, data: PageCreation): Promise<PageResponse> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/pages/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
