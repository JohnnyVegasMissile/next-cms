// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export const GET = async () => {
    const container = await prisma.container.findMany({
        where: { published: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    })

    return NextResponse.json(container)
}
