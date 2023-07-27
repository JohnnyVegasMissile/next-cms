import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import UserCreation from '~/types/userCreation'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')
    const page = searchParams.get('page')
    const roleId = searchParams.get('roleId')
    const sort = searchParams.get('sort')

    let skip = 0
    if (typeof page === 'string' && page !== '0' && page !== '1') {
        skip = (parseInt(page) - 1) * PAGE_SIZE
    }

    const where: any = { login: { root: false } }
    let orderBy: any = {}

    if (!!q) where.OR = [{ name: { contains: q } }, { login: { email: { contains: q } } }]
    if (!!roleId) where.login.roleId = roleId
    if (!!sort) {
        const parsedSort = sort.split(',')

        if (parsedSort[0] === 'slug') {
            orderBy = { slug: { full: parsedSort[1] } }
        } else {
            orderBy = { [`${parsedSort[0]}`]: parsedSort[1] }
        }
    }

    const count = await prisma.user.count({ where })
    const users = await prisma.user.findMany({
        where,
        orderBy,
        take: PAGE_SIZE,
        skip,
        include: {
            login: { select: { email: true, role: true } },
        },
    })

    return NextResponse.json({ results: users, count })
}

export const POST = async (request: NextRequest) => {
    const { name, role, email, password } = (await request.json()) as UserCreation

    if (typeof name !== 'string') return NextResponse.json({ message: 'Name not valid' }, { status: 400 })

    const existingRole = await prisma.role.findUnique({ where: { id: role } })
    if (!existingRole || typeof role !== 'string')
        return NextResponse.json({ message: 'Role not valid' }, { status: 400 })

    if (typeof email !== 'string') return NextResponse.json({ message: 'Email not valid' }, { status: 400 })
    if (typeof password !== 'string')
        return NextResponse.json({ message: 'Password not valid' }, { status: 400 })

    const user = await prisma.user.create({
        data: {
            name,
            login: {
                create: {
                    email,
                    password,
                    roleId: existingRole.id,
                },
            },
        },
    })

    return NextResponse.json(user, { status: 200 })
}
