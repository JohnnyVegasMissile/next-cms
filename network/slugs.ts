import { Page, Slug } from '@prisma/client'
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
