import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { Page } from '@prisma/client'

const prisma = new PrismaClient()

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const pages: Page[] = await prisma.page.findMany()

    return res.status(200).json(pages)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const page: Page = await prisma.page.create({ data: req.body })

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
