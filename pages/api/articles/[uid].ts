import { FullArticleEdit } from '../../../types'
import type { NextApiRequest, NextApiResponse } from 'next'
// import type { Page, Metadata, Section, Article } from '@prisma/client'
// import get from 'lodash.get'

import { prisma } from '../../../utils/prisma'
import { Article, Prisma, Section } from '@prisma/client'
import get from 'lodash.get'

const GET = async (req: NextApiRequest, res: NextApiResponse<Article | {}>) => {
    const id = req.query.uid as string

    const article = await prisma.article.findUnique({
        where: { id },
        include: { sections: true },
    })

    if (!article) return res.status(404).json({ error: 'User not found' })

    return res.status(200).json(article)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse<Article | {}>) => {
    const id = req.query.uid as string
    const newArticleContent: FullArticleEdit = req.body

    // delete existing sections
    await prisma.section.deleteMany({
        where: { articleId: id },
    })

    // create new sections
    const newSections: Section[] = get(req, 'body.sections', [])
    delete newArticleContent.sections

    for (const section of newSections) {
        await prisma.section.create({
            data: {
                articleId: id,
                type: section.type,
                elementId: section.elementId,
                position: section.position,
                content: section.content,
            },
        })
    }

    const article = await prisma.article.update({
        where: { id },
        data: newArticleContent as Prisma.ArticleCreateInput,
        include: { sections: true, page: true },
    })

    res.status(200).json(article)

    return res.unstable_revalidate(`/${article.page.slug}/${article.slug}`)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse<Article | {}>) => {
    const id = req.query.uid as string

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
