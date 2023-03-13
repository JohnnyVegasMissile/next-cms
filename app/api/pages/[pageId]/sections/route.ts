// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET(_: NextRequest, context: any) {
    const { pageId } = context.params

    const sections = await prisma.section.findMany({
        where: { pageId: parseInt(pageId) },
        orderBy: { position: 'asc' },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(sections)
}
