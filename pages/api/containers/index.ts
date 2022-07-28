import type { NextApiRequest, NextApiResponse } from 'next'
import type { Metadata, Section, Prisma, ContainerField } from '@prisma/client'
import get from 'lodash.get'
import { FullContainerEdit } from '../../../types'

import { prisma } from '../../../utils/prisma'

// interface FullPage extends Page {
//     metadatas?: Metadata[]
//     sections?: Section[]
// }

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    // const type = req.query.type as string | undefined
    const q = req.query.q as string | undefined

    let where: any

    if (!!q) {
        const sliptedQ = q.split(' ')

        if (sliptedQ.length === 1) {
            where = { title: { contains: q } }
        } else {
            const OR = sliptedQ.map((word) => ({
                title: {
                    contains: word,
                },
            }))

            where = { OR }
        }
    }

    const pages = await prisma.container.findMany({ where })

    return res.status(200).json(pages)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const newPageContent = req.body as FullContainerEdit

    const fields: ContainerField[] = get(req, 'body.fields', [])
    delete newPageContent.fields
    const sections: Section[] = get(req, 'body.sections', [])
    delete newPageContent.sections
    const contentSections: Section[] = get(req, 'body.contentSections', [])
    delete newPageContent.contentSections
    const metadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newPageContent.metadatas
    const accesses: string[] = get(req, 'body.accesses', [])
    delete newPageContent.accesses

    const page = await prisma.container.create({
        data: {
            ...(newPageContent as Prisma.ContainerCreateInput),
            fields: { create: fields },
            metadatas: { create: metadatas },
            sections: { create: sections },
            contentSections: { create: contentSections },
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
