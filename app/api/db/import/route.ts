// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
// import { prisma } from '~/utilities/prisma'
// import { IncomingForm } from 'formidable'
// import mv from 'mv'
// import get from 'lodash.get'
// import mime from 'mime-types'

// export const POST = async (req: NextResponse) => {
//     const form = new IncomingForm()

//     await form.parse(req, (err, _, files) => {
//         if (err) return NextResponse.json({ success: false })

//         const file: File | undefined | any = Array.isArray(files['file'])
//             ? get(files, 'file.0', undefined)
//             : files['file']

//         if (!file) return res.status(400).json({ error: 'No file' })

//         if (mime.extension(file.mimetype) !== 'ico') {
//             return res.status(400).json({ error: 'Wrong file type' })
//         }

//         var oldPath = file.filepath
//         var newPath = './uploads/favicon.ico'

//         mv(oldPath, newPath, function (err) {
//             if (err) return res.status(500).json({ error: err })
//         })

//         return NextResponse.json({ success: true })
//     })
// }

import formidable, { IncomingForm } from 'formidable'

// export const config = {
//     api: {
//         bodyParser: false, // enable form data
//     },
// }
export const dynamicParams = false

const formidableParse = async (req: NextResponse) =>
    new Promise((resolve, reject) =>
        new formidable.IncomingForm().parse(req, (err, fields, files) =>
            err ? reject(err) : resolve([fields, files])
        )
    )

export async function POST(req: NextResponse) {
    const form = new IncomingForm()

    const file = await form.parse(req, (err, _, files) => (err ? err : files))
    console.log('file', file)

    // const [fields, files] = await formidableParse(req)
    // console.log(files)
}
