import { NextResponse, NextRequest } from 'next/server'
import type PageCreation from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import { revalidatePath } from 'next/cache'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const page = searchParams.get('page')
    const formId = searchParams.get('formId')
    const sort = searchParams.get('sort')
    const read = searchParams.get('read')
    const marked = searchParams.get('marked')

    let skip = 0
    if (typeof page === 'string' && page !== '0' && page !== '1') {
        skip = (parseInt(page) - 1) * PAGE_SIZE
    }

    const where: any = {}
    let orderBy: any = {}

    if (!!read) where.read = read === 'true'
    if (!!marked) where.marked = marked === 'true'
    if (!!formId) where.formId = formId
    if (!!sort) {
        const parsedSort = sort.split(',')

        orderBy = { [`${parsedSort[0]}`]: parsedSort[1] }
    }

    const count = await prisma.message.count({ where })
    const pages = await prisma.message.findMany({
        where,
        orderBy,
        take: PAGE_SIZE,
        skip,
        include: {
            form: true,
            readBy: true,
        },
    })

    return NextResponse.json({ results: pages, count })
}

export const POST = async (request: NextRequest) => {
    const { name, slug, published, metadatas } = (await request.json()) as PageCreation

    if (typeof name !== 'string') return NextResponse.json({ message: 'Name not valid' }, { status: 400 })

    if (!Array.isArray(slug)) return NextResponse.json({ message: 'Slug not valid.' }, { status: 400 })

    if (typeof published !== 'boolean')
        return NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const page = await prisma.page.create({
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
        },
    })

    revalidatePath(slug.join('/'))

    return NextResponse.json(page, { status: 200 })
}
