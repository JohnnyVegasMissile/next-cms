import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET(_: NextRequest, context: any) {
    const { userId } = context.params

    const page = await prisma.page.findUnique({
        where: { id: userId as number },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(page)
}
