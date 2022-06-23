import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { Page } from '@prisma/client'

const prisma = new PrismaClient()

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const homes: Page[] = await prisma.page.findMany({
        where: { type: 'home' },
    })

    if (!homes.length) {
        const page: Page = await prisma.page.create({
            data: {
                type: 'home',
                title: 'Home',
                slug: '/',
            },
        })

        return res.status(200).json(page)
    }

    const errors: Page[] = await prisma.page.findMany({
        where: { type: 'error' },
    })

    if (!errors.length) {
        const page: Page = await prisma.page.create({
            data: {
                type: 'error',
                title: 'Not Found',
                slug: '/not-found',
            },
        })

        return res.status(200).json(page)
    }
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const init = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default init
