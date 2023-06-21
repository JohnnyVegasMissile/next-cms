import PageCreation from '~/types/pageCreation'
import INSTANCE from './api'
import { Metadata, Page, PageType, Section, Slug } from '@prisma/client'
import { ObjectId } from '~/types'
import { SectionCreationCleaned } from '~/types/sectionCreation'

type PageResponse = Page & {
    slug: Slug | null
    metadatas: Metadata[]
}

export const getPages = (
    page: number,
    q: string,
    sort: `${string},${'asc' | 'desc'}` | undefined,
    others: { type: PageType | undefined }
): Promise<{
    results: PageResponse[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/pages`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, sort, ...others },
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

export const updatePage = (id: ObjectId, data: PageCreation): Promise<PageResponse> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/pages/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const updatePageSections = (
    id: ObjectId,
    data: { content: SectionCreationCleaned[]; sidebar: SectionCreationCleaned[] }
): Promise<Section[]> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/pages/${id}/sections`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
