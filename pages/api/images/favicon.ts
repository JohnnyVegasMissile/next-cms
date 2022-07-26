import type { NextApiRequest, NextApiResponse } from 'next'
// import { promises as fs } from 'fs'
import { IncomingForm } from 'formidable'
import mv from 'mv'
import get from 'lodash.get'
import mime from 'mime-types'

export const config = {
    api: {
        bodyParser: false,
    },
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const form = new IncomingForm()

    await form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'err' })

        const file: File | undefined | any = Array.isArray(files.file)
            ? get(files, 'file.0', undefined)
            : files.file

        if (!file) return res.status(400).json({ error: 'No file' })

        if (mime.extension(file.mimetype) !== 'ico') {
            return res.status(400).json({ error: 'Wrong file type' })
        }

        var oldPath = file.filepath
        var newPath = './uploads/favicon.ico'

        mv(oldPath, newPath, function (err) {
            if (err) return res.status(500).json({ error: err })
        })

        return res.status(200).json('favicon updated')
    })
}

const ERROR = async (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(405).json({ error: 'Method not allowed' })
}

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST': {
            return await POST(req, res)
        }

        default: {
            return await ERROR(req, res)
        }
    }
}

export default upload
