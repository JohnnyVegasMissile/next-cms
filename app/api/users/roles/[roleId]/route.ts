/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { RightType } from '@prisma/client'
import RoleCreation from '~/types/roleCreation'

export async function GET(_: NextRequest, context: any) {
    const { roleId } = context.params

    const role = await prisma.role.findUnique({
        where: { id: roleId },
    })

    if (!role) NextResponse.json({ message: "Role doesn't exist" }, { status: 404 })

    // NextResponse extends the Web Response API
    return NextResponse.json(role)
}

export async function PUT(request: Request, context: any) {
    const { roleId } = context.params
    const { name, rights, limitUpload } = (await request.json()) as RoleCreation

    if (typeof name !== 'string') return NextResponse.json({ message: 'Name not valid' }, { status: 400 })

    if (rights.includes(RightType.UPLOAD_MEDIA) && isNaN(parseInt(limitUpload as unknown as string)))
        return NextResponse.json({ message: 'Limit upload not valid' }, { status: 400 })

    if (Array.isArray(rights)) {
        for (const right of rights) {
            if (RightType[right] === undefined)
                return NextResponse.json({ message: `Rights ${right} not valid` }, { status: 400 })
        }
    } else {
        return NextResponse.json({ message: 'Rights not valid' }, { status: 400 })
    }

    const role = await prisma.role.update({
        where: { id: roleId },
        data: {
            name,
            limitUpload: rights.includes(RightType.UPLOAD_MEDIA) ? limitUpload : undefined,
            rights: Array.from(rights),
        },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(role)
}
