import type { NextApiRequest, NextApiResponse } from 'next'
import { Metadata, Section, Prisma, ContainerField } from '@prisma/client'
import get from 'lodash.get'
import { FullContainerEdit } from '../../../types'

import { prisma } from '../../../utils/prisma'

// interface FullPage extends Page {
//     metadatas?: Metadata[]
//     sections?: Section[]
// }

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const q = req.query.q as string | undefined

    let search: any = {
        where: {},
        include: {
            contents: true,
        },
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

    const containers = await prisma.container.findMany(search)

    return res.status(200).json(containers)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const newContainerContent = req.body as FullContainerEdit

    const fields: ContainerField[] = get(req, 'body.fields', [])
    delete newContainerContent.fields
    const sections: Section[] = get(req, 'body.sections', [])
    delete newContainerContent.sections
    const contentSections: Section[] = get(req, 'body.contentSections', [])
    delete newContainerContent.contentSections
    const metadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newContainerContent.metadatas
    const accesses: string[] = get(req, 'body.accesses', [])
    delete newContainerContent.accesses

    const slug: string = get(req, 'body.slugEdit', '').join('/')

    const container = await prisma.container.create({
        data: {
            ...(newContainerContent as Prisma.ContainerCreateInput),
            fields: { create: fields },
            metadatas: { create: metadatas },
            sections: { create: sections },
            contentSections: { create: contentSections },
            accesses: {
                create: accesses.map((access) => ({ roleId: access })),
            },
            slug: undefined,
        },
    })

    await prisma.slug.create({
        data: {
            fullSlug: encodeURI(slug),
            slug: encodeURI(slug),
            containerId: container.id,
            published: true,
        },
    })

    return res.status(200).json(container)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const containers = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default containers
