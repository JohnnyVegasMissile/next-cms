import checkAuth from '@utils/checkAuth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../utils/prisma'

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const slugs = await prisma.slug.findMany()

    try {
        const urls: string[] = []

        for (const slug of slugs) {
            const uri = `/${slug.fullSlug}`
            await res.revalidate(uri)
            urls.push(uri)
        }

        return res.status(200).json({ revalidated: urls })
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
    const isAuth = await checkAuth(req.headers)

    if (!isAuth) {
        return res.status(403).json({ error: 'Forbidden' })
    }

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
