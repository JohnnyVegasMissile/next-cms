import type { NextApiRequest, NextApiResponse } from 'next'
import type { Metadata, Section, Prisma, ContentField } from '@prisma/client'
import get from 'lodash.get'

import { prisma } from '../../../utils/prisma'
import checkAuth from '@utils/checkAuth'
import getNameFieldFromType from '../../../utils/getNameFieldFromType'

// interface FullPage extends Page {
//     metadatas?: Metadata[]
//     sections?: Section[]
// }

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const container = req.query.container as string | undefined
    const q = req.query.q as string | undefined

    let search: any = {
        where: {},
        include: { container: true, slug: true },
        orderBy: {
            updatedAt: 'desc',
        },
    }

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

    const fields: ContentField[] = get(req, 'body.fields', [])
    delete newContentContent.fields
    const sections: Section[] = get(req, 'body.sections', [])
    delete newContentContent.sections
    const metadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newContentContent.metadatas
    const accesses: string[] = get(req, 'body.accesses', [])
    delete newContentContent.accesses

    const slug: string = get(req, 'body.slug', '')
    const containerId: string = get(req, 'body.containerId', '')

    const parentSlug = await prisma.slug.findUnique({
        where: {
            containerId,
        },
    })

    const withMultiFields = fields.map((field, idx) => {
        if (field.multiple) {
            const valueName = getNameFieldFromType(field.type)
            const values = get(field, valueName, [])

            return {
                ...field,
                childs: {
                    create: values?.map((e: any, i: number) => ({
                        name: field.name,
                        type: field.type,
                        [valueName]: e,
                    })),
                },
                [valueName]: undefined,
            }
        }

        return field
    })

    console.log('withMultiFields', withMultiFields)

    const content = await prisma.content.create({
        data: {
            ...(newContentContent as Prisma.ContentCreateInput),
            fields: { create: withMultiFields },
            metadatas: { create: metadatas },
            sections: { create: sections },
            accesses: {
                create: accesses.map((access) => ({ roleId: access })),
            },
            slug: {
                create: {
                    parentId: parentSlug!.id,
                    fullSlug: `${parentSlug!.slug}/${slug}`,
                    slug: slug,
                    published: true,
                },
            },
        },
    })

    return res.status(200).json(content)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const pages = async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuth = await checkAuth(req.headers)

    if (!isAuth) {
        return res.status(403).json({ error: 'Forbidden' })
    }

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
