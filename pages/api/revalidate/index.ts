import checkAuth from '@utils/checkAuth'
import type { NextApiRequest, NextApiResponse } from 'next'

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.body.url) {
        return res.status(401).json({ message: 'URL missing' })
    }

    try {
        await res.revalidate(req.body.url)
        return res.json({ revalidated: req.body.url })
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
