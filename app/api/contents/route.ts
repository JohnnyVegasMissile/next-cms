// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import ContainerCreation from '~/types/containerCreation'
import ContentCreation from '~/types/contentCreation'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')
    const page = searchParams.get('page')
    const sort = searchParams.get('sort')
    const containerId = searchParams.get('containerId')

    let skip = 0
    if (typeof page === 'string' && page !== '0' && page !== '1') {
        skip = (parseInt(page) - 1) * PAGE_SIZE
    }

    const where: any = {}
    let orderBy: any = {}

    if (!!q) where.name = { contains: q }
    if (!!containerId) where.containerId = { containerId }
    if (!!sort) {
        const parsedSort = sort.split(',')

        if (parsedSort[0] === 'slug') {
            orderBy = { slug: { full: parsedSort[1] } }
        } else {
            orderBy = { [`${parsedSort[0]}`]: parsedSort[1] }
        }
    }

    const count = await prisma.content.count({ where })
    const contents = await prisma.content.findMany({
        where,
        orderBy,
        take: PAGE_SIZE,
        skip,
        include: { slug: true, fields: true, container: { include: { fields: true } } },
    })

    return NextResponse.json({ results: contents, count })
}

export const POST = async (request: NextRequest) => {
    const { name, slug, published, metadatas, fields, containerId } =
        (await request.json()) as ContentCreation<Date>

    if (typeof name !== 'string') return NextResponse.json({ message: 'Name not valid' }, { status: 400 })
    if (typeof slug !== 'string') return NextResponse.json({ message: 'Slug not valid.' }, { status: 400 })
    if (typeof published !== 'boolean')
        return NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: { slug: true },
    })

    if (!container) return NextResponse.json({ message: 'Container not valid' }, { status: 400 })

    const content = await prisma.content.create({
        data: {
            name,
            published,
            containerId: containerId!,
            slug: {
                create: {
                    parentId: container.slug!.id,
                    full: `${container.slug!.full}/${slug}`,
                    basic: slug,
                },
            },
            metadatas: { createMany: { data: metadatas } },
            fields: { createMany: { data: fields } },
        },
    })

    return NextResponse.json(content, { status: 200 })
}
