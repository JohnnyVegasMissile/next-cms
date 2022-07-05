import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../utils/prisma'

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const pages = await prisma.page.findMany({
        include: { articles: true },
    })

    try {
        const urls: string[] = []

        for (const page of pages) {
            const slug = `/${page.slug}`

            await res.unstable_revalidate(slug)
            urls.push(slug)

            for (const article of page.articles) {
                const slugArticle = `${slug}/${article.slug}`

                await res.unstable_revalidate(slugArticle)
                urls.push(slugArticle)
            }
        }

        return res.json({ revalidated: urls })
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const pages = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST': {
            return await POST(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default pages
