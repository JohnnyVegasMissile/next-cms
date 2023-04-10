import { Page, PageType, Slug } from '@prisma/client'
import INSTANCE from './api'
import { ObjectId } from '~/types'

export const getSlugs = (
    q: string
): Promise<
    (Slug & {
        page: Page | null
    })[]
> =>
    INSTANCE({
        method: 'GET',
        url: `/api/slugs`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { q },
    })

export const getSlugsSimple = (
    q?: string
): Promise<
    (Slug & {
        page: {
            id: string
            name: string
            type: PageType
        } | null
        container: {
            id: string
            name: string
        } | null
        childs: (Slug & {
            content: {
                id: string
                name: string
            } | null
        })[]
    })[]
> =>
    INSTANCE({
        method: 'GET',
        url: `/api/slugs/simple`,
        headers: {
            'Content-Type': 'application/json',
        },
        params: { q },
    })

export const slugExist = (
    slug: string,
    paramsId?: { pageId: ObjectId } | { containerId: ObjectId } | { contentId: ObjectId } | undefined
): Promise<{ exist: boolean }> =>
    INSTANCE({
        method: 'GET',
        url: '/api/slugs/exists',
        headers: {
            'Content-Type': 'application/json',
        },
        params: { slug, ...paramsId },
    })
