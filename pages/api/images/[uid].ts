import type { NextApiRequest, NextApiResponse } from 'next'
import type { Media } from '@prisma/client'
import { promises as fs } from 'fs'

import { prisma } from '../../../utils/prisma'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const image = await prisma.media.findUnique({
        where: { id },
    })

    if (!image) return res.status(500).json({ error: 'Image not found' })

    return res.status(200).json(image)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const image: Media = await prisma.media.delete({
        where: { id },
    })

    if (!image) return res.status(500).json({ error: 'File does not exist' })

    try {
        await fs.unlink(`./public${process.env.UPLOADS_IMAGES_DIR}/${image.uri}`)
    } catch (e) {
        return res.status(201).json({ message: `File does not exist` })
    }

    return res.status(200).json({ message: `File ${image.name} remove succesfully` })
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query.uid as string

    const image: Media = await prisma.media.update({
        where: { id },
        data: req.body,
    })

    return res.status(200).json(image)
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const pages = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        case 'DELETE': {
            return await DELETE(req, res)
        }

        case 'PUT': {
            return await PUT(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default pages
