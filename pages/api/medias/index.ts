import type { NextApiRequest, NextApiResponse } from 'next'
// import { promises as fs } from 'fs'
import { IncomingForm } from 'formidable'
import mv from 'mv'
import get from 'lodash.get'
import mime from 'mime-types'
import { MediaType, Prisma } from '@prisma/client'
import type { Media } from '@prisma/client'

import { prisma } from '~/utilities/prisma'
// import checkAuth from '@utils/checkAuth'

export function makeId(length: number) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const q = req.query['q'] as string | undefined
    const type = req.query['type'] as string | undefined

    let where: any = {
        type: MediaType.IMAGE,
    }

    if (type === MediaType.VIDEO) {
        where.type = MediaType.VIDEO
    } else if (type === MediaType.FILE) {
        where.type = MediaType.FILE
    }

    if (!!q) {
        const sliptedQ = q.split(' ')

        if (sliptedQ.length === 1) {
            where.name = {
                contains: q,
            }
        } else {
            let OR = sliptedQ.map((word) => ({
                name: {
                    contains: word,
                },
            }))

            where.OR = OR
        }
    }

    const files: Media[] = await prisma.media.findMany({
        where,
        orderBy: {
            createdAt: 'desc',
        },
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

    await form.parse(req, async (err, _, files) => {
        if (err) return res.status(500).json({ error: 'err' })

        const file: Media | undefined | any = Array.isArray(files['file'])
            ? get(files, 'file.0', undefined)
            : files['file']

        if (!file) return res.status(400).json({ error: 'No file' })

        var oldPath = file.filepath
        var newFileName = `FILE-${makeId(10)}-${makeId(10)}.${mime.extension(file.mimetype)}`

        let fileSpecs: any = { folder: 'files', type: MediaType.FILE }
        if (file.mimetype.startsWith('image/')) {
            fileSpecs = { folder: 'images', type: MediaType.IMAGE }
        } else if (file.mimetype.startsWith('video/')) {
            fileSpecs = { folder: 'videos', type: MediaType.VIDEO }
        }

        var newPath = `./uploads/${fileSpecs.folder}/${newFileName}`

        mv(oldPath, newPath, function (err) {
            if (err) return res.status(500).json({ error: err })
        })

        const fileInfos: Prisma.MediaCreateInput = {
            uri: newFileName,
            type: 'IMAGE',
            mimeType: file.mimetype,
            name: file.originalFilename,
            size: file.size,
        }

        const createdFile = await prisma.media.create({ data: fileInfos })

        if (!file) {
            return res.status(500).json({ error: err })
        }

        return res.status(200).json(createdFile)
        // .catch((err) => )
    })
}

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
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

        case 'POST': {
            // if (isAuth.user.rights.includes(RightType.CREATE_MEDIA)) {
            return await POST(req, res)
            // }
            // return res.status(405).json({ error: 'Method not allowed' })
        }

        default: {
            return res.status(404).json({ error: 'Not found' })
        }
    }
}

export default upload
