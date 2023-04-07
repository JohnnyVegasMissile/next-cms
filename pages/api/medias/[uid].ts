import type { NextApiRequest, NextApiResponse } from 'next'
import { Media } from '@prisma/client'
import { promises as fs } from 'fs'

import { prisma } from '~/utilities/prisma'
// import checkAuth from '@utils/checkAuth'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query['uid'] as string

    const image = await prisma.media.findUnique({
        where: { id },
    })

    if (!image) return res.status(500).json({ error: 'Image not found' })

    return res.status(200).json(image)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query['uid'] as string

    const image: Media = await prisma.media.delete({
        where: { id },
    })

    if (!image) return res.status(500).json({ error: 'File does not exist' })

    try {
        await fs.unlink(`./uploads/images/${image.uri}`)
    } catch (e) {
        return res.status(201).json({ message: `File does not exist` })
    }

    return res.status(200).json({ message: `File ${image.name} remove succesfully` })
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.query['uid'] as string

    const image: Media = await prisma.media.update({
        where: { id },
        data: { alt: req.body.alt },
    })

    return res.status(200).json(image)
}

const pages = async (req: NextApiRequest, res: NextApiResponse) => {
    // const isAuth = await checkAuth(req.headers)

    // if (!isAuth) {
    //     return res.status(403).json({ error: 'Forbidden' })
    // }

    switch (req.method) {
        case 'GET': {
            // if (isAuth.user.rights.includes(RightType.VIEW_MEDIA)) {
            return await GET(req, res)
            // }
            // return res.status(405).json({ error: 'Method not allowed' })
        }

        case 'PUT': {
            // if (isAuth.user.rights.includes(RightType.UPDATE_MEDIA)) {
            return await PUT(req, res)
            // }
            return res.status(405).json({ error: 'Method not allowed' })
        }

        case 'DELETE': {
            // if (isAuth.user.rights.includes(RightType.DELETE_MEDIA)) {
            return await DELETE(req, res)
            // }
            // return res.status(405).json({ error: 'Method not allowed' })
        }

        default: {
            return res.status(404).json({ error: 'Not found' })
        }
    }
}

export default pages
