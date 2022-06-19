import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { Page } from '@prisma/client'

const prisma = new PrismaClient()

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(
        Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid
    )
    const page: Page | null = await prisma.page.findUnique({ where: { id } })

    return res.status(200).json(page)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(
        Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid
    )
    const page: Page = await prisma.page.update({
        where: { id },
        data: req.body,
    })

    return res.status(200).json(page)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(
        Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid
    )
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
