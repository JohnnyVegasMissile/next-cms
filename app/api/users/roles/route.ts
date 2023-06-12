// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import type RoleCreation from '~/types/roleCreation'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')
    const page = searchParams.get('page')
    const sort = searchParams.get('sort')

    let skip = 0
    if (typeof page === 'string' && page !== '0' && page !== '1') {
        skip = (parseInt(page) - 1) * PAGE_SIZE
    }

    const where: any = {}
    let orderBy: any = {}

    if (!!q) where.name = { contains: q }
    if (!!sort) {
        const parsedSort = sort.split(',')

        if (parsedSort[0] === 'slug') {
            orderBy = { slug: { full: parsedSort[1] } }
        } else {
            orderBy = { [`${parsedSort[0]}`]: parsedSort[1] }
        }
    }

    const count = await prisma.role.count({ where })
    const roles = await prisma.role.findMany({
        where,
        orderBy,
        take: PAGE_SIZE,
        skip,
        include: {
            _count: {
                select: { logins: true },
            },
        },
    })

    return NextResponse.json({ results: roles, count })
}

export const POST = async (request: NextRequest) => {
    const { name, rights, limitUpload } = (await request.json()) as RoleCreation

    if (typeof name !== 'string') return NextResponse.json({ message: 'Name not valid' }, { status: 400 })

    if (isNaN(parseInt(limitUpload as unknown as string))) {
        NextResponse.json({ message: 'Limit upload not valid' }, { status: 400 })
    }

    const page = await prisma.role.create({
        data: {
            name,
            limitUpload,
            rights: Array.from(rights),
        },
    })

    return NextResponse.json(page, { status: 200 })
}
