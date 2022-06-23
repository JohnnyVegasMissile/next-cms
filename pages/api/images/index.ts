import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const dirName = './public/uploads/images'

    const filenames = await fs.readdir(dirName)

    return res.status(200).json(filenames)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const dirName = './public/uploads/images'

    if (req.body.filename)
        return res.status(500).json({ error: 'filename missing' })

    await fs.unlink(`${dirName}/${req.body.filename}`)

    return res
        .status(200)
        .json({ message: `File ${req.body.filename} remove succesfully` })
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
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

export default upload
