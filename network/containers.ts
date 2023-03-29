import INSTANCE from './api'
import { Container, ContainerField, Metadata, Section, Slug } from '@prisma/client'
import { ObjectId } from '~/types'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import ContainerCreation from '~/types/containerCreation'

export type ContainerResponse = Container & {
    slug: Slug | null
    fields: ContainerField[]
    metadatas: Metadata[]
    contentsMetadatas: Metadata[]
}

export const getContainers = (
    page: number,
    q: string,
    sort: `${string},${'asc' | 'desc'}` | undefined,
    others: {}
): Promise<{
    results: ContainerResponse[]
    count: number
}> =>
    INSTANCE({
        method: 'GET',
        url: '/api/containers',
        headers: {
            'Content-Type': 'application/json',
        },
        params: { page, q, sort, ...others },
    })

export const getContainer = (id: ObjectId): Promise<ContainerResponse> =>
    INSTANCE({
        method: 'GET',
        url: `/api/containers/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const postContainer = (data: ContainerCreation<string>): Promise<ContainerResponse> =>
    INSTANCE({
        method: 'POST',
        url: '/api/containers',
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const updateContainer = (id: ObjectId, data: ContainerCreation<string>): Promise<ContainerResponse> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/containers/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })

export const getContainerSections = (id: ObjectId): Promise<{ content: Section[]; sidebar: Section[] }> =>
    INSTANCE({
        method: 'GET',
        url: `/api/containers/${id}/sections`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const getContainerTemplate = (
    id: ObjectId
): Promise<{
    topContent: Section[]
    bottomContent: Section[]
    topSidebar: Section[]
    bottomSidebar: Section[]
}> =>
    INSTANCE({
        method: 'GET',
        url: `/api/containers/${id}/template/sections`,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export const updateContainerSections = (
    id: ObjectId,
    data: { content: SectionCreationCleaned[]; sidebar: SectionCreationCleaned[] }
): Promise<Section[]> =>
    INSTANCE({
        method: 'PUT',
        url: `/api/containers/${id}/sections`,
        headers: {
            'Content-Type': 'application/json',
        },
        data,
    })
