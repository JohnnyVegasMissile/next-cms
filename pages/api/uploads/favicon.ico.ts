import type { NextApiRequest, NextApiResponse } from 'next'
// import get from 'lodash.get'
import { promises as fs } from 'fs'
import mime from 'mime-types'

const GET = async (_: NextApiRequest, res: NextApiResponse) => {
    // const id = req.query.uid as string
    try {
        const file = await fs.readFile('./uploads/favicon.ico')

        res.setHeader('Content-Type', mime.lookup('ico') || '')
        return res.send(file)
    } catch (e) {
        return res.status(201).json({ message: `File does not exist` })
    }
}

const uploads = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        default: {
            return res.status(404).json({ error: 'Not found' })
        }
    }
}

export default uploads
