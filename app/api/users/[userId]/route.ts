/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import UserCreation from '~/types/userCreation'

export async function GET(_: NextRequest, context: any) {
    const { userId } = context.params

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            login: { select: { email: true, roleId: true } },
        },
    })

    if (!user) NextResponse.json({ message: "User doesn't exist" }, { status: 404 })

    // NextResponse extends the Web Response API
    return NextResponse.json(user)
}

export async function PUT(request: Request, context: any) {
    const { userId } = context.params
    const { name, role, email, password } = (await request.json()) as UserCreation

    if (typeof name !== 'string') return NextResponse.json({ message: 'Name not valid' }, { status: 400 })

    const existingRole = await prisma.role.findUnique({ where: { id: role } })
    if (!existingRole || typeof role !== 'string')
        return NextResponse.json({ message: 'Role not valid' }, { status: 400 })

    if (typeof email !== 'string') return NextResponse.json({ message: 'Email not valid' }, { status: 400 })

    if (!!password && typeof password !== 'string')
        return NextResponse.json({ message: 'Password not valid' }, { status: 400 })

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            login: {
                update: {
                    email,
                    password,
                    roleId: existingRole.id,
                },
            },
        },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(user)
}
