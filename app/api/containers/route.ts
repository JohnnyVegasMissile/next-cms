// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import ContainerCreation from '~/types/containerCreation'

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

    const count = await prisma.container.count({ where })
    const container = await prisma.container.findMany({
        where,
        orderBy,
        take: PAGE_SIZE,
        skip,
        include: { slug: true },
    })

    return NextResponse.json({ results: container, count })
}

export const POST = async (request: NextRequest) => {
    const { name, slug, published, metadatas, fields } = (await request.json()) as ContainerCreation<Date>

    if (typeof name !== 'string') NextResponse.json({ message: 'Name not valid' }, { status: 400 })
    if (!Array.isArray(slug)) NextResponse.json({ message: 'Slug not valid.' }, { status: 400 })
    if (typeof published !== 'boolean') NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const container = await prisma.container.create({
        data: {
            name,
            published,
            slug: {
                create: {
                    full: slug.join('/'),
                    basic: slug.join('/'),
                },
            },
            metadatas: {
                createMany: {
                    data: metadatas.map((metadata) => ({
                        content: Array.isArray(metadata.content)
                            ? metadata.content.join(', ')
                            : metadata.content,
                        name: metadata.name,
                    })),
                },
            },
            fields: { createMany: { data: fields } },
        },
    })

    return NextResponse.json(container, { status: 200 })
}
