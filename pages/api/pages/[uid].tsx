import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { Page, Metadata, Section } from '@prisma/client'
import get from 'lodash.get'

const prisma = new PrismaClient()

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(
        Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid
    )
    const page: Page | null = await prisma.page.findUnique({
        where: { id },
        include: { metadatas: true },
    })

    return res.status(200).json(page)
}

interface FullPage extends Page {
    metadatas?: Metadata[]
    sections?: Section[]
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(
        Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid
    )

    const newPageContent: FullPage = req.body

    // put the metadatas separately
    const newMetadatas: Metadata[] = get(req, 'body.metadatas', [])
    delete newPageContent.metadatas

    // get the actual metadatas
    const currentMetadatas: Metadata[] = await prisma.metadata.findMany({
        where: { pageId: id },
    })

    // update the metadatas
    while (newMetadatas.length) {
        const tempNewMeta = newMetadatas.shift()
        const tempOldMeta = currentMetadatas.shift()

        if (tempOldMeta) {
            await prisma.metadata.update({
                where: { id: tempOldMeta.id },
                data: { ...tempNewMeta },
            })
        } else if (tempNewMeta) {
            await prisma.metadata.create({
                data: { ...tempNewMeta, pageId: id },
            })
        }
    }

    // delete the remaining metadatas
    while (currentMetadatas.length) {
        const tempMeta = currentMetadatas.shift()

        await prisma.metadata.delete({ where: { id: tempMeta?.id } })
    }

    // update the page
    const page: Page = await prisma.page.update({
        where: { id },
        data: newPageContent,
    })

    res.status(200).json(page)

    return res.unstable_revalidate(`/${page.slug}`)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(
        Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid
    )

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
