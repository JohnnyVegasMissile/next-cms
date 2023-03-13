import { Page, Slug } from '@prisma/client'
import INSTANCE from './api'

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
