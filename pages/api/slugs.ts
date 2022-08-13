import checkAuth from '@utils/checkAuth'
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const slugs = await prisma.slug.findMany({
        orderBy: { fullSlug: 'asc' },
        include: { container: true, content: true },
    })

    return res.status(200).json(slugs)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const me = async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuth = await checkAuth(req.headers)

    if (!isAuth) {
        return res.status(403).json({ error: 'Forbidden' })
    }

    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default me
