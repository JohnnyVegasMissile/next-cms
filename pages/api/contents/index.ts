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
    const container = req.query.container as string | undefined
    const q = req.query.q as string | undefined

    let search: any = { where: {}, include: { container: true } }

    if (!!container) {
        search.where.containerId = container
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

    const contents = await prisma.content.findMany(search)

    return res.status(200).json(contents)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const newContentContent = req.body

    const fields: ContainerField[] = get(req, 'body.fields', [])
    delete newContentContent.fields
    const sections: Section[] = get(req, 'body.sections', [])
    delete newContentContent.sections
    const metadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newContentContent.metadatas
    const accesses: string[] = get(req, 'body.accesses', [])
    delete newContentContent.accesses

    const content = await prisma.content.create({
        data: {
            ...(newContentContent as Prisma.ContentCreateInput),
            fields: { create: fields },
            metadatas: { create: metadatas },
            sections: { create: sections },
            accesses: {
                create: accesses.map((access) => ({ roleId: access })),
            },
        },
    })

    return res.status(200).json(content)
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
