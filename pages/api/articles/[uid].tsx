import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { Page, Metadata, Section, Article } from '@prisma/client'
import get from 'lodash.get'

const prisma = new PrismaClient()

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(req.query.uid as string)

    const article = await prisma.article.findUnique({
        where: { id },
    })

    if (!article) return res.status(500).json({ error: 'User not found' })

    return res.status(200).json(article)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(req.query.uid as string)

    const article = await prisma.article.update({
        where: { id },
        data: req.body,
    })

    return res.status(200).json(article)

    // return res.unstable_revalidate(`/${page.slug}`)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(req.query.uid as string)

    const article = await prisma.article.delete({ where: { id } })

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
