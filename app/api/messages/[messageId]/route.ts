import { NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function GET(_: Request, context: any) {
    const { messageId } = context.params

    await prisma.message.update({
        where: { id: messageId },
        data: { read: true },
    })

    const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
            form: {
                include: {
                    fields: {
                        orderBy: { position: 'asc' },
                    },
                },
            },
            fields: true,
            readBy: true,
        },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(message)
}

export async function PUT(request: Request, context: any) {
    const { messageId } = context.params
    const { marked } = (await request.json()) as any

    if (typeof marked !== 'boolean') NextResponse.json({ message: 'Marked not valid' }, { status: 400 })

    const message = await prisma.message.update({
        where: { id: messageId },
        data: { marked: marked },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(message)
}
