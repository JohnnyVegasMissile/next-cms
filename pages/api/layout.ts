import type { NextApiRequest, NextApiResponse } from 'next'
// import get from 'lodash.get'

import { prisma } from '../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const header = await prisma.section.findMany({
        where: { type: 'header' },
    })

    const topBody = await prisma.section.findMany({
        where: { type: 'top-body' },
    })

    const bottomBody = await prisma.section.findMany({
        where: { type: 'bottom-body' },
    })

    const footer = await prisma.section.findMany({
        where: { type: 'footer' },
    })

    return res.status(200).json({ header, topBody, bottomBody, footer })
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const { header, topBody, bottomBody, footer } = req.body

    // delete existing sections
    await prisma.section.deleteMany({
        where: { type: 'header' },
    })

    // create new sections
    for (const section of header) {
        await prisma.section.create({
            data: {
                formId: section.formId,
                type: 'header',
                block: section.block,
                elementId: section.elementId,
                position: section.position,
                content: section.content,
            },
        })
    }

    // delete existing sections
    await prisma.section.deleteMany({
        where: { type: 'top-body' },
    })

    // create new sections
    for (const section of topBody) {
        await prisma.section.create({
            data: {
                formId: section.formId,
                type: 'top-body',
                block: section.block,
                elementId: section.elementId,
                position: section.position,
                content: section.content,
            },
        })
    }

    // delete existing sections
    await prisma.section.deleteMany({
        where: { type: 'bottom-body' },
    })

    // create new sections
    for (const section of bottomBody) {
        await prisma.section.create({
            data: {
                formId: section.formId,
                type: 'bottom-body',
                block: section.block,
                elementId: section.elementId,
                position: section.position,
                content: section.content,
            },
        })
    }

    // delete existing sections
    await prisma.section.deleteMany({
        where: { type: 'footer' },
    })

    // create new sections
    for (const section of footer) {
        await prisma.section.create({
            data: {
                formId: section.formId,
                type: 'footer',
                block: section.block,
                elementId: section.elementId,
                position: section.position,
                content: section.content,
            },
        })
    }

    return res.status(200).json({ message: 'Updated !' })
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const users = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default users
