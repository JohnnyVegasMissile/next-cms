// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const slug = searchParams.get('slug')
    const pageId = searchParams.get('pageId')
    const containerId = searchParams.get('containerId')
    const contentId = searchParams.get('contentId')

    if (!slug) {
        return NextResponse.json({ message: 'Slug not valid' }, { status: 400 })
    }

    const matchingId: any = {}

    if (!!pageId) {
        matchingId.NOT = { pageId }
    } else if (!!containerId) {
        matchingId.NOT = { containerId }
    } else if (!!contentId) {
        matchingId.NOT = { contentId }
    }

    const existingSlug = await prisma.slug.findFirst({
        where: { full: slug, ...matchingId },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json({ exist: !!existingSlug })
}
