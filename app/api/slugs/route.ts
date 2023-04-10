// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')

    let where = {}

    if (!!q)
        where = {
            OR: [
                { page: { name: { contains: q } } },
                { container: { name: { contains: q } } },
                { content: { name: { contains: q } } },
            ],
        }

    const slugs = await prisma.slug.findMany({ where, include: { page: true } })

    // NextResponse extends the Web Response API
    return NextResponse.json(slugs)
}
