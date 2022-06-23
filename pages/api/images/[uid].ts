import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import type { Media } from '@prisma/client'
import { promises as fs } from 'fs'

const prisma = new PrismaClient()

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(
        Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid
    )
    const image: Media = await prisma.media.delete({
        where: { id },
    })

    if (!image) return res.status(500).json({ error: 'File does not exist' })

    await fs.unlink(`./public${process.env.UPLOADS_IMAGES_DIR}/${image.uri}`)

    return res
        .status(200)
        .json({ message: `File ${image.name} remove succesfully` })
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = parseInt(
        Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid
    )
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
