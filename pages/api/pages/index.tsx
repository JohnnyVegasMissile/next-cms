import type { NextApiRequest, NextApiResponse } from 'next'
import type { Page, Metadata, Section } from '@prisma/client'
import get from 'lodash.get'
import { PageTypes, FullPageEdit } from '../../../types'

import { prisma } from '../../../utils/prisma'

// interface FullPage extends Page {
//     metadatas?: Metadata[]
//     sections?: Section[]
// }

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const type = req.query.type as PageTypes
    const search = !!type ? { where: { type } } : undefined

    const pages: Page[] = await prisma.page.findMany(search)

    return res.status(200).json(pages)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const newPageContent: FullPageEdit = req.body

    const sections: Section[] = get(req, 'body.sections', [])
    const metadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newPageContent.sections
    delete newPageContent.metadatas
    delete newPageContent.articles

    const page: Page = await prisma.page.create({
        data: {
            ...newPageContent,
            metadatas: { create: metadatas },
            sections: { create: sections },
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
