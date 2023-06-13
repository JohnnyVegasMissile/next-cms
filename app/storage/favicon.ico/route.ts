// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import mime from 'mime-types'

export const GET = async () => {
    let file: Buffer | undefined

    try {
        file = await fs.readFile(`./uploads/favicon.ico`)
    } catch (error) {
        return NextResponse.json({ message: 'Invalid url' }, { status: 404 })
    }

    if (!file) return NextResponse.json({ message: 'Invalid url' }, { status: 404 })

    return new Response(file, {
        status: 200,
        headers: { 'Content-Type': mime.lookup('ico') || '' },
    })
}
