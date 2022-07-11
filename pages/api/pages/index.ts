import type { NextApiRequest, NextApiResponse } from 'next'
import type { Page, Metadata, Section, Prisma } from '@prisma/client'
import get from 'lodash.get'
import { PageTypes, FullPageEdit } from '../../../types'

import { prisma } from '../../../utils/prisma'

// interface FullPage extends Page {
//     metadatas?: Metadata[]
//     sections?: Section[]
// }

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const type = req.query.type as PageTypes | undefined
    const q = req.query.q as string | undefined

    let search: any = { where: {} }

    if (!!type) {
        search.where.type = type
    }

    if (!!q) {
        const sliptedQ = q.split(' ')

        if (sliptedQ.length === 1) {
            search.where.title = {
                contains: q,
            }
        } else {
            let OR = sliptedQ.map((word) => ({
                title: {
                    contains: word,
                },
            }))

            search.where.OR = OR
        }
    }

    const pages: Page[] = await prisma.page.findMany(search)

    return res.status(200).json(pages)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const newPageContent = req.body as FullPageEdit

    const sections: Section[] = get(req, 'body.sections', [])
    const metadatas: Metadata[] = get(req, 'body.metadatas', [])
    const accesses: string[] = get(req, 'body.accesses', [])
    delete newPageContent.sections
    delete newPageContent.metadatas
    delete newPageContent.accesses
    // delete newPageContent.articles

    const page: Page = await prisma.page.create({
        data: {
            ...(newPageContent as Prisma.PageCreateInput),
            metadatas: { create: metadatas },
            sections: { create: sections },
            accesses: {
                create: accesses.map((access) => ({ roleId: access })),
            },
        },
    })

    return res.status(200).json(page)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const pages = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        case 'POST': {
            return await POST(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default pages
