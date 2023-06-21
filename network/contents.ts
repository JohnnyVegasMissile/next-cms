import INSTANCE from './api'
import { Container, ContainerField, Content, ContentField, Metadata, Section, Slug } from '@prisma/client'
import { ObjectId } from '~/types'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import ContentCreation from '~/types/contentCreation'

export type ContentResponse = Content & {
    slug: Slug | null
    fields: ContentField[]
    metadatas: Metadata[]
    container: (Container & { fields: ContainerField[] }) | null
}

export const getContents = (
    page: number,
    q: string,
    sort: `${string},${'asc' | 'desc'}` | undefined,
    others: any
): Promise<{
    results: ContentResponse[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: '/api/contents',
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, sort, ...others },
    })

export const getContent = (id: ObjectId): Promise<ContentResponse> =>
    INSTANCE({
        method: 'GET',
        url: `/api/contents/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const postContent = (data: ContentCreation<string>): Promise<ContentResponse> =>
    INSTANCE({
        method: 'POST',
        url: '/api/contents',
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const updateContent = (id: ObjectId, data: ContentCreation<string>): Promise<ContentResponse> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/contents/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const updateContentSections = (
    id: ObjectId,
    data: { content: SectionCreationCleaned[]; sidebar: SectionCreationCleaned[] }
): Promise<Section[]> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/contents/${id}/sections`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
