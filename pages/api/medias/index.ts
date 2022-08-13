import type { NextApiRequest, NextApiResponse } from 'next'
// import { promises as fs } from 'fs'
import { IncomingForm } from 'formidable'
import mv from 'mv'
import get from 'lodash.get'
import mime from 'mime-types'
import { Prisma } from '@prisma/client'
import type { Media } from '@prisma/client'

import { makeId } from '../../../utils'
import { prisma } from '../../../utils/prisma'
import checkAuth from '@utils/checkAuth'

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const q = req.query.q as string | undefined
    const type = req.query.type as string | undefined

    let search: any = {}

    if (!!q) {
        const sliptedQ = q.split(' ')

        if (sliptedQ.length === 1) {
            search.name = {
                contains: q,
            }
        } else {
            let OR = sliptedQ.map((word) => ({
                name: {
                    contains: word,
                },
            }))

            search.OR = OR
        }
    }

    let mime: any = { mimeType: { startsWith: 'image/' } }

    switch (type) {
        case 'images': {
            mime = {
                mimeType: { startsWith: 'image/' },
            }
            break
        }
        case 'videos': {
            mime = {
                mimeType: { startsWith: 'video/' },
            }
            break
        }
        case 'files': {
            mime = {
                AND: [
                    { NOT: { mimeType: { startsWith: 'image/' } } },
                    { NOT: { mimeType: { startsWith: 'video/' } } },
                ],
            }
            break
        }
    }

    const files: Media[] = await prisma.media.findMany({
        where: {
            AND: [mime, { ...search }],
        },
        orderBy: {
            uploadTime: 'desc',
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

    await form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'err' })

        const file: Media | undefined | any = Array.isArray(files.file)
            ? get(files, 'file.0', undefined)
            : files.file

        if (!file) return res.status(400).json({ error: 'No file' })
        // console.log('file', file?.duration)

        var oldPath = file.filepath
        var newFileName = `FILE-${makeId(10)}-${makeId(10)}.${mime.extension(file.mimetype)}`

        let folder = 'files'
        if (file.mimetype.startsWith('image/')) {
            folder = 'images'
        } else if (file.mimetype.startsWith('video/')) {
            folder = 'videos'
        }

        var newPath = `./uploads/${folder}/${newFileName}`

        mv(oldPath, newPath, function (err) {
            if (err) return res.status(500).json({ error: err })
        })

        const fileInfos: Prisma.MediaCreateInput = {
            uri: newFileName,
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

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuth = await checkAuth(req.headers)

    if (!isAuth) {
        return res.status(403).json({ error: 'Forbidden' })
    }

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
