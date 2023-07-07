import { NextResponse, NextRequest } from 'next/server'
import type PageCreation from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import { revalidatePath } from 'next/cache'
import { LinkValue } from '~/components/LinkSelect'
import { LinkProtocol, LinkType, Media, MediaType } from '@prisma/client'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')
    const page = searchParams.get('page')
    const type = searchParams.get('type')
    const sort = searchParams.get('sort')

    let skip = 0
    if (typeof page === 'string' && page !== '0' && page !== '1') {
        skip = (parseInt(page) - 1) * PAGE_SIZE
    }

    const where: any = {}
    let orderBy: any = {}

    if (!!q) where.name = { contains: q }
    if (!!type) where.type = type
    if (!!sort) {
        const parsedSort = sort.split(',')

        if (parsedSort[0] === 'slug') {
            orderBy = { slug: { full: parsedSort[1] } }
        } else {
            orderBy = { [`${parsedSort[0]}`]: parsedSort[1] }
        }
    }

    const count = await prisma.page.count({ where })
    const pages = await prisma.page.findMany({
        where,
        orderBy,
        take: PAGE_SIZE,
        skip,
        include: { slug: true },
    })

    return NextResponse.json({ results: pages, count })
}

const parseCreateValues = (values: (string | number | boolean | LinkValue | Media)[]) => ({
    createMany: {
        data: values.map((value) => {
            switch (typeof value) {
                case 'string':
                    return { string: value }
                case 'boolean':
                    return { boolean: value }
                case 'number':
                    return { number: value }

                default: {
                    if (
                        value?.type === MediaType.IMAGE ||
                        value?.type === MediaType.FILE ||
                        value?.type === MediaType.VIDEO
                    ) {
                        return { mediaId: value.id }
                    } else {
                        if (value?.type === LinkType.IN) {
                            return {
                                link: {
                                    upset: {
                                        where: { slugId: value.slugId },
                                    },
                                    data: { type: LinkType.IN },
                                },
                            }
                        } else if (value?.type === LinkType.OUT) {
                            return {
                                link: {
                                    create: {
                                        data: {
                                            type: LinkType.OUT,
                                            link: value.link || '',
                                            protocol: value.prototol || LinkProtocol.HTTPS,
                                        },
                                    },
                                },
                            }
                        }
                    }

                    return { string: '' }
                }
            }
        }),
    },
})

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
        },
    })

    for (const metadata of metadatas) {
        await prisma.metadata.create({
            data: {
                pageId: page.id,
                types: metadata.types,
                values: parseCreateValues(metadata.values),
            },
        })
    }

    revalidatePath(slug.join('/'))

    return NextResponse.json(page, { status: 200 })
}
