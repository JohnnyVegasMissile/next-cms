import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET(_: NextRequest, context: any) {
    const { pageId } = context.params

    const metrics = await prisma.metric.findMany({
        where: { slug: { pageId } },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(metrics)
}
