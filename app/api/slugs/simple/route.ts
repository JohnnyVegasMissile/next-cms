// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q') || ''

    const slugs = await prisma.slug.findMany({
        where: {
            parentId: null,
            OR: [
                { page: { name: { contains: q }, published: true } },
                { container: { name: { contains: q }, published: true } },
                { childs: { some: { content: { name: { contains: q }, published: true } } } },
            ],
        },
        include: {
            page: { select: { id: true, name: true, type: true } },
            container: { select: { id: true, name: true } },
            childs: {
                where: { content: { name: { contains: q }, published: true } },
                include: { content: { select: { id: true, name: true } } },
            },
        },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(slugs)
}
