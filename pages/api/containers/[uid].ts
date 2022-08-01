import { ContainerField, Metadata, Prisma, Section } from '@prisma/client'
import { FullContainerEdit } from '@types'
import get from 'lodash.get'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const container = await prisma.container.findUnique({
        where: { id },
        include: {
            metadatas: true,
            accesses: true,
            sections: true,
            contentSections: true,
            fields: true,
            slug: true,
        },
    })

    if (!container) {
        return res.status(404).json({ error: 'Container not found' })
    }

    return res.status(200).json(container)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const newContainerContent: FullContainerEdit = req.body

    // delete existing fields
    await prisma.containerField.deleteMany({
        where: { containerId: id },
    })

    // put the fields separately
    const newFields: ContainerField[] = get(req, 'body.fields', [])
    delete newContainerContent.fields

    for (const field of newFields) {
        await prisma.containerField.create({
            data: {
                containerId: id,
                label: field.label,
                name: field.name,
                type: field.type,
                metadata: field.metadata,
                required: field.required,
            },
        })
    }

    // delete existing metadatas
    await prisma.metadata.deleteMany({
        where: { containerId: id },
    })

    // put the metadatas separately
    const newMetadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newContainerContent.metadatas

    for (const metadata of newMetadatas) {
        await prisma.metadata.create({
            data: {
                containerId: id,
                name: metadata.name,
                content: metadata.content,
            },
        })
    }

    // delete existing sections
    await prisma.section.deleteMany({
        where: { containerId: id },
    })

    // create new sections
    const newSections: Section[] = get(req, 'body.sections', [])
    delete newContainerContent.sections

    for (const section of newSections) {
        await prisma.section.create({
            data: {
                containerId: id,
                formId: section.formId,
                type: section.type,
                elementId: section.elementId,
                position: section.position,
                content: section.content,
            },
        })
    }

    if (newContainerContent.contentHasSections) {
        // create new sections
        const newContentSections: Section[] = get(req, 'body.contentSections', [])
        delete newContainerContent.contentSections

        for (const section of newContentSections) {
            await prisma.section.create({
                data: {
                    containerContentId: id,
                    formId: section.formId,
                    type: section.type,
                    elementId: section.elementId,
                    position: section.position,
                    content: section.content,
                },
            })
        }

        // delete existing access
        await prisma.access.deleteMany({
            where: { containerId: id },
        })
    }

    // create new access
    const newAccesses: string[] = get(req, 'body.accesses', [])
    delete newContainerContent.accesses

    for (const roleId of newAccesses) {
        await prisma.access.create({
            data: {
                containerId: id,
                roleId,
            },
        })
    }

    // update the page
    const container = await prisma.container.update({
        where: { id },
        data: newContainerContent as Prisma.ContainerCreateInput,
        include: {
            metadatas: true,
            accesses: true,
            sections: true,
            contentSections: true,
            fields: true,
            contents: true,
            slug: true,
        },
    })

    const newSlug = encodeURI(newContainerContent.slugEdit?.join('/') || '')

    if (container.slug[0].fullSlug === newSlug) {
        res.status(200).json(container)

        return res.unstable_revalidate(container.slug[0].fullSlug)
    }

    const slugs = await prisma.slug.findMany({
        where: { OR: [{ containerId: id, parent: { containerId: id } }] },
    })

    for (const slug of slugs) {
        const data =
            slug.containerId === id
                ? {
                      fullSlug: `${newSlug}/${slug.slug}`,
                  }
                : {
                      fullSlug: newSlug,
                      slug: newSlug,
                  }

        await prisma.slug.update({
            where: { id: slug.id },
            data,
        })

        await res.unstable_revalidate(data.fullSlug)
    }

    res.status(200).json(container)
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
