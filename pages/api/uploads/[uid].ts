import type { NextApiRequest, NextApiResponse } from 'next'
// import get from 'lodash.get'
import { promises as fs } from 'fs'
import mime from 'mime-types'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string
    try {
        const file = await fs.readFile(`./public${process.env.UPLOADS_IMAGES_DIR}/${id}`)

        const ext = id.split('.')[1]

        res.setHeader('Content-Type', mime.lookup(ext) || '')
        return res.send(file)
    } catch (e) {
        return res.status(201).json({ message: `File does not exist` })
    }
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json({})
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const uploads = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        case 'DELETE': {
            return await DELETE(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default uploads
