import type { NextApiRequest, NextApiResponse } from 'next'
// import type { Page, Metadata, Section, Article } from '@prisma/client'
// import get from 'lodash.get'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const element = await prisma.element.findUnique({
        where: { id },
    })

    if (!element) return res.status(500).json({ error: 'User not found' })

    return res.status(200).json(element)
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const element = await prisma.element.update({
        where: { id },
        data: req.body,
    })

    res.status(200).json(element)

    const URIs = new Set<string>()

    const pagesReval = await prisma.page.findMany({
        where: {
            OR: [
                { headerId: id },
                { footerId: id },
                {
                    sections: {
                        some: {
                            elementId: id,
                        },
                    },
                },
            ],
            published: true,
        },
        include: { articles: true },
    })

    for (const page of pagesReval) {
        const slug = `/${page.slug}`
        URIs.add(slug)

        for (const article of page.articles) {
            const slugArticle = `${slug}/${article.slug}`

            await res.unstable_revalidate(slugArticle)
            URIs.add(slugArticle)
        }
    }

    const sectionsReval = await prisma.section.findMany({
        where: {
            elementId: id,
        },
        include: { page: true, article: { include: { page: true } } },
    })

    for (const section of sectionsReval) {
        if (!!section.page) {
            const slug = `/${section.page?.slug}`
            URIs.add(slug)
        } else if (!!section.article) {
            const slug = `/${section.article?.page.slug}/${section.article?.slug}`
            URIs.add(slug)
        }
    }

    console.log(URIs)
    await URIs.forEach((uri) => res.unstable_revalidate(uri))
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const element = await prisma.element.delete({ where: { id } })

    return res.status(200).json(element)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const elements = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default elements
