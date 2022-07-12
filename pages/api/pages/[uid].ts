import type { NextApiRequest, NextApiResponse } from 'next'
import type { Page, Metadata, Section, Access, Prisma } from '@prisma/client'
import get from 'lodash.get'

import { prisma } from '../../../utils/prisma'
import { FullPageEdit } from 'types'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const page: Page | null = await prisma.page.findUnique({
        where: { id },
        include: { metadatas: true, sections: true, accesses: true },
    })

    if (!page) {
        return res.status(404).json({ error: 'Page not found' })
    }

    return res.status(200).json(page)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const newPageContent: FullPageEdit = req.body

    // delete existing metadatas
    await prisma.metadata.deleteMany({
        where: { pageId: id },
    })

    // put the metadatas separately
    const newMetadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newPageContent.metadatas

    for (const metadata of newMetadatas) {
        await prisma.metadata.create({
            data: {
                pageId: id,
                name: metadata.name,
                content: metadata.content,
            },
        })
    }

    // delete existing sections
    await prisma.section.deleteMany({
        where: { pageId: id },
    })

    // create new sections
    const newSections: Section[] = get(req, 'body.sections', [])
    delete newPageContent.sections

    for (const section of newSections) {
        await prisma.section.create({
            data: {
                type: section.type,
                pageId: id,
                position: section.position,
                content: section.content,
            },
        })
    }

    // delete existing access
    await prisma.access.deleteMany({
        where: { pageId: id },
    })

    // create new access
    const newAccesses: string[] = get(req, 'body.accesses', [])
    delete newPageContent.accesses

    for (const roleId of newAccesses) {
        await prisma.access.create({
            data: {
                pageId: id,
                roleId,
            },
        })
    }

    // update the page
    const page = await prisma.page.update({
        where: { id },
        data: newPageContent as Prisma.PageCreateInput,
        include: { metadatas: true, sections: true },
    })

    res.status(200).json(page)

    return res.unstable_revalidate(`/${page.slug}`)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    await prisma.metadata.deleteMany({
        where: {
            pageId: id,
        },
    })

    await prisma.section.deleteMany({
        where: {
            pageId: id,
        },
    })

    await prisma.article.deleteMany({
        where: {
            pageId: id,
        },
    })

    const page = await prisma.page.delete({ where: { id } })

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
