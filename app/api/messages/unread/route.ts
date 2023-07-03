import { NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET() {
    const count = await prisma.message.count({
        where: { read: false },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json({ count })
}
