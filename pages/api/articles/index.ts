import { Prisma, Section } from '@prisma/client'
import { FullArticleEdit } from '../../../types'
import get from 'lodash.get'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const pageId = req.query.pageId as string | undefined
    const q = req.query.q as string | undefined

    let search: any = { where: {} }

    if (!!pageId) {
        search.where.pageId = pageId
    }

    if (!!q) {
        const sliptedQ = q.split(' ')

        if (sliptedQ.length === 1) {
            search.where.title = {
                contains: q,
            }
        } else {
            let OR = sliptedQ.map((word) => ({
                title: {
                    contains: word,
                },
            }))

            search.where.OR = OR
        }
    }

    const article = await prisma.article.findMany({ ...search, include: { page: true } })

    return res.status(200).json(article)
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const newArticleContent = req.body as FullArticleEdit

    const sections: Section[] = get(req, 'body.sections', [])
    delete newArticleContent.sections

    const article = await prisma.article.create({
        data: {
            ...(newArticleContent as Prisma.ArticleCreateInput),
            sections: { create: sections },
        },
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
