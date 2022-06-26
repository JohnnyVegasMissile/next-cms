import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { Page, Metadata, Section, Article } from '@prisma/client'
import get from 'lodash.get'

const prisma = new PrismaClient()

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const article = await prisma.article.findMany()

    return res.status(200).json(article)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const article = await prisma.article.create({
        data: { ...req.body },
    })

    return res.status(200).json(article)
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
