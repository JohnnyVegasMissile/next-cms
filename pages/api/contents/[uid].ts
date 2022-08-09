import get from 'lodash.get'
import checkAuth from '@utils/checkAuth'
import { FullContainerEdit } from '../../../types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ContainerField, ContentField, Metadata, Prisma, Section } from '@prisma/client'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const container = await prisma.content.findUnique({
        where: { id },
        include: {
            metadatas: true,
            accesses: true,
            sections: true,
            slug: true,
            fields: { include: { media: true } },
        },
    })

    if (!container) {
        return res.status(404).json({ error: 'Container not found' })
    }

    return res.status(200).json(container)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const newContentContent: FullContainerEdit = req.body

    // delete existing fields
    await prisma.contentField.deleteMany({
        where: { contentId: id },
    })

    // put the fields separately
    const newFields: ContentField[] = get(req, 'body.fields', [])
    delete newContentContent.fields

    for (const field of newFields) {
        await prisma.contentField.create({
            data: {
                contentId: id,

                name: field.name,
                type: field.type,

                mediaId: field.mediaId,
                textValue: field.textValue,
                numberValue: field.numberValue,
                boolValue: field.boolValue,
                dateValue: field.dateValue,
            },
        })
    }

    // delete existing metadatas
    await prisma.metadata.deleteMany({
        where: { contentId: id },
    })

    // put the metadatas separately
    const newMetadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newContentContent.metadatas

    for (const metadata of newMetadatas) {
        await prisma.metadata.create({
            data: {
                contentId: id,
                name: metadata.name,
                content: metadata.content,
            },
        })
    }

    // delete existing sections
    await prisma.section.deleteMany({
        where: { contentId: id },
    })

    // create new sections
    const newSections: Section[] = get(req, 'body.sections', [])
    delete newContentContent.sections

    for (const section of newSections) {
        await prisma.section.create({
            data: {
                contentId: id,
                formId: section.formId,
                type: 'page',
                block: section.block,
                elementId: section.elementId,
                position: section.position,
                content: section.content,
            },
        })
    }

    const newSlug = encodeURI(get(newContentContent, 'slug', '') as string)
    delete newContentContent.slug

    // create new access
    const newAccesses: string[] = get(req, 'body.accesses', [])
    delete newContentContent.accesses

    for (const roleId of newAccesses) {
        await prisma.access.create({
            data: {
                contentId: id,
                roleId,
            },
        })
    }

    // update the page
    const content = await prisma.content.update({
        where: { id },
        data: newContentContent,
        include: {
            metadatas: true,
            accesses: true,
            sections: true,
            fields: true,
            slug: { include: { parent: true } },
        },
    })

    if (content.slug[0].slug !== newSlug) {
        await prisma.slug.update({
            where: { id: content.slug[0].id || '' },
            data: { fullSlug: `${content.slug[0].parent?.fullSlug}/${newSlug}`, slug: newSlug },
        })
    }

    res.status(200).json(content)

    return res.revalidate(`/${content.slug[0].fullSlug}`) //`/${page.slug}`)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    // await prisma.metadata.deleteMany({
    //     where: {
    //         pageId: id,
    //     },
    // })

    // await prisma.access.deleteMany({
    //     where: {
    //         pageId: id,
    //     },
    // })

    // await prisma.section.deleteMany({
    //     where: {
    //         pageId: id,
    //     },
    // })

    // await prisma.article.deleteMany({
    //     where: {
    //         pageId: id,
    //     },
    // })

    // await prisma.article.deleteMany({
    //     where: {
    //         pageId: id,
    //     },
    // })

    const page = await prisma.container.delete({ where: { id } })

    return res.status(200).json(page)
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

        case 'PUT': {
            return await PUT(req, res)
        }

        case 'DELETE': {
            return await DELETE(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default pages
