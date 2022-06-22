import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import mv from 'mv'
import get from 'lodash.get'
import mime from 'mime-types'

import { makeId } from '../../../utils'

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// }

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const form = new IncomingForm()

    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'err' })

        const file: File | undefined | any = Array.isArray(files.file)
            ? get(files, 'file.0', undefined)
            : files.file

        if (!file) return res.status(400).json({ error: 'No file' })

        var oldPath = file.filepath
        var newFileName = `file-${makeId(10)}-${makeId(10)}.${mime.extension(
            file.mimetype
        )}`

        var newPath = `./public/uploads/images/${newFileName}`

        mv(oldPath, newPath, function (err) {
            if (err) return res.status(500).json({ error: err })
        })

        const fileInfos = {
            uri: newFileName,
            mimetype: file.mimetype,
            name: file.originalFilename,
            size: file.size,
            uploadTime: file.mtime,
        }

        return res.status(200).json(fileInfos)
    })
}

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    const dirName = './public/uploads/images'

    const filenames = await fs.readdir(dirName)

    return res.status(200).json(filenames)
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const dirName = './public/uploads/images'

    console.log('req', req.body.filename)

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
        case 'POST': {
            return await POST(req, res)
        }

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
