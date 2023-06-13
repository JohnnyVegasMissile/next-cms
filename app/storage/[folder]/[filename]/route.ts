// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import mime from 'mime-types'

export const GET = async (_: NextRequest, { params }: any) => {
    const { folder, filename } = params

    let file: Buffer | undefined

    try {
        file = await fs.readFile(`./uploads/${folder}/${filename}`)
    } catch (error) {
        return NextResponse.json({ message: 'Invalid url' }, { status: 404 })
    }

    if (!file) return NextResponse.json({ message: 'Invalid url' }, { status: 404 })

    const ext = filename.split('.')[1]

    return new Response(file, {
        status: 200,
        headers: { 'Content-Type': mime.lookup(ext!) || '' },
    })
}
