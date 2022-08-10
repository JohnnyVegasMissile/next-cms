import type { NextApiRequest, NextApiResponse } from 'next'
// import get from 'lodash.get'
import { promises as fs } from 'fs'
import mime from 'mime-types'
import checkAuth from '@utils/checkAuth'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    // const id = req.query.uid as string
    try {
        const file = await fs.readFile('./uploads/favicon.ico')

        res.setHeader('Content-Type', mime.lookup('ico') || '')
        return res.send(file)
    } catch (e) {
        console.log('err', e)
        return res.status(201).json({ message: `File does not exist` })
    }
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const uploads = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default uploads
