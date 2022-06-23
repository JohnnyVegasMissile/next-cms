import type { NextApiRequest, NextApiResponse } from 'next'
// import { promises as fs } from 'fs'
import { IncomingForm } from 'formidable'
import mv from 'mv'
import get from 'lodash.get'
import mime from 'mime-types'
import { PrismaClient, Prisma } from '@prisma/client'
import type { Media } from '@prisma/client'

import { makeId } from '../../../utils'

const prisma = new PrismaClient()
const mimeTypesImages = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // 'image/svg+xml',
    // 'image/bmp',
    // 'image/tiff',
]
const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const files: Media[] = await prisma.media.findMany({
        where: { OR: mimeTypesImages.map((mimeType) => ({ mimeType })) },
    })

    return res.status(200).json(files)
}

export const config = {
    api: {
        bodyParser: false,
    },
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const form = new IncomingForm()

    await form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'err' })

        const file: Media | undefined | any = Array.isArray(files.file)
            ? get(files, 'file.0', undefined)
            : files.file

        if (!file) return res.status(400).json({ error: 'No file' })

        var oldPath = file.filepath
        var newFileName = `FILE-${makeId(10)}-${makeId(10)}.${mime.extension(
            file.mimetype
        )}`

        var newPath = `./public${process.env.UPLOADS_IMAGES_DIR}/${newFileName}`

        mv(oldPath, newPath, function (err) {
            if (err) return res.status(500).json({ error: err })
        })

        const fileInfos: Prisma.MediaCreateInput = {
            uri: newFileName,
            mimeType: file.mimetype,
            name: file.originalFilename,
            size: file.size,
        }

        prisma.media
            .create({ data: fileInfos })
            .then((e) => {
                res.status(200).json(e)
            })
            .catch((err) => res.status(500).json({ error: err }))
    })
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET': {
            return await GET(req, res)
        }

        case 'POST': {
            return await POST(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default upload
