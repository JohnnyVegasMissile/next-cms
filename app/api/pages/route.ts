import { NextResponse, NextRequest } from 'next/server'
import type PageCreation from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import { revalidatePath } from 'next/cache'
import { CodeLanguage, LinkType } from '@prisma/client'
import { CreationMetadata } from '~/types/pageCreation'

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

    const cleanMetadatas: CreationMetadata[] = []

    Object.keys(metadatas).forEach((key) => {
        const macthingMetadatas = metadatas[key as CodeLanguage | 'ALL']

        const language = key === 'ALL' ? undefined : (key as CodeLanguage)

        for (const metadata of macthingMetadatas!) {
            cleanMetadatas.push({
                ...metadata,
                language,
            })
        }
    })

    for (const metadata of cleanMetadatas) {
        const metadataId = (
            await prisma.metadata.create({
                data: { types: metadata.types, pageId: page.id, language: metadata.language },
            })
        )?.id

        await prisma.metadataValue.createMany({
            data: metadata.values.map((value) => {
                if (typeof value === 'string') {
                    return { metadataId, string: value }
                } else if (typeof value === 'number') {
                    return { metadataId, number: value }
                } else if (typeof value === 'boolean') {
                    return { metadataId, boolean: value }
                } else if (value?.type === 'IN') {
                    return {
                        metadataId,
                        link: {
                            connectOrCreate: {
                                where: { slugId: value.slugId },
                                create: {
                                    type: LinkType.IN,
                                    slugId: value.slugId,
                                },
                            },
                        },
                    }
                } else if (value?.type === 'OUT') {
                    return {
                        metadataId,
                        link: {
                            create: {
                                data: {
                                    type: value.type,
                                    link: value.link,
                                    prototol: value.prototol,
                                },
                            },
                        },
                    }
                } else {
                    return {
                        metadataId,
                        mediaId: value?.id,
                    }
                }
            }),
        })
    }

    revalidatePath(slug.join('/'))

    return NextResponse.json(page, { status: 200 })
}
