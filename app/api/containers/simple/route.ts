// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')

    const where: any = { published: false }
    if (!!q) where.name = { contains: q }

    const containers = await prisma.container.findMany({
        where,
        take: 15,
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    })

    return NextResponse.json(containers)
}
