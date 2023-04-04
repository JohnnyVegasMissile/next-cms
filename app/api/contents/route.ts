// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'
import { PAGE_SIZE } from '~/utilities/constants'
import ContentCreation from '~/types/contentCreation'
import { ObjectId } from '~/types'
import { ContainerFieldType } from '@prisma/client'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')
    const page = searchParams.get('page')
    const sort = searchParams.get('sort')
    const containerId = searchParams.get('containerId')

    const advancedSort = searchParams.get('advancedSort')
    const advancedFilters = searchParams.get('advancedFilters')

    const where: any = {}
    let orderBy: any = {}

    if (!!containerId && (!!advancedSort || !!advancedFilters)) {
        const container = await prisma.container.findUnique({
            where: { id: containerId! },
            include: { fields: true },
        })

        if (!container) return NextResponse.json({ message: 'Container not valid' }, { status: 400 })

        // if (!!advancedSort) {
        //     const contentsSort: { field: ObjectId; order: 'asc' | 'desc' } = JSON.parse(advancedSort)

        //         const contents = await prisma.content.findMany({
        //             orderBy: {
        //                 fields: {

        //                 }
        //             }
        //         })

        //     console.log(contentsSort)
        // }

        if (!!advancedFilters) {
            const contentsSort: {
                [key: ObjectId]: { operator: 'contains' | 'equals' | 'gt' | 'lt'; value: any }
            } = JSON.parse(advancedFilters)

            const AND = Object.keys(contentsSort).map((key) => {
                const matchingField = container.fields.find((f) => f.id === key)
                let keyData: 'numberValue' | 'textValue' | 'dateValue' = 'textValue'

                if (!matchingField) return

                switch (matchingField.type) {
                    case ContainerFieldType.RICHTEXT:
                    case ContainerFieldType.COLOR:
                    case ContainerFieldType.CONTENT:
                    case ContainerFieldType.VIDEO:
                    case ContainerFieldType.FILE:
                    case ContainerFieldType.IMAGE:
                    case ContainerFieldType.PARAGRAPH:
                    case ContainerFieldType.STRING:
                    case ContainerFieldType.OPTION: {
                        if (matchingField.multiple) {
                            return
                        } else {
                            keyData = 'textValue'
                        }
                        break
                    }

                    case ContainerFieldType.NUMBER: {
                        if (matchingField.multiple) {
                            return
                        } else {
                            keyData = 'numberValue'
                        }
                        break
                    }

                    case ContainerFieldType.DATE: {
                        if (matchingField.multiple) {
                            return
                        } else {
                            keyData = 'dateValue'
                        }
                        break
                    }

                    case ContainerFieldType.LOCATION:
                    case ContainerFieldType.LINK: {
                        if (matchingField.multiple) {
                            return
                        } else {
                            return
                        }
                        break
                    }
                }

                return {
                    releatedFieldId: key,
                    [keyData]: { [contentsSort[key]?.operator!]: contentsSort[key]?.value },
                }
            })

            where.fields = { some: { AND } }

            // nulls: 'last'
        }
    }

    let skip = 0
    if (typeof page === 'string' && page !== '0' && page !== '1') {
        skip = (parseInt(page) - 1) * PAGE_SIZE
    }

    if (!!q) where.name = { contains: q }
    if (!!containerId) where.containerId = containerId
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
