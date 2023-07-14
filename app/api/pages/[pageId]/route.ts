import { LinkType, PageType, SettingType } from '@prisma/client'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import PageCreation from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'

export async function PUT(request: Request, context: any) {
    const { pageId } = context.params
    const { name, slug, published, metadatas } = (await request.json()) as PageCreation

    if (typeof name !== 'string') NextResponse.json({ message: 'Name not valid' }, { status: 400 })
    if (!Array.isArray(slug)) NextResponse.json({ message: 'Slug not valid.' }, { status: 400 })
    if (typeof published !== 'boolean') NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const notIn: string[] = []

    for (const metadata of metadatas) {
        let metadataId: string | undefined

        if (!!metadata.id) {
            metadataId = metadata.id

            await prisma.metadataValue.deleteMany({ where: { metadataId } })

            await prisma.metadata.update({
                where: { id: metadata.id },
                data: { types: metadata.types },
            })
        } else {
            metadataId = (
                await prisma.metadata.create({
                    data: { types: metadata.types, pageId },
                })
            )?.id
        }

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
                    return { metadataId, mediaId: value?.id }
                }
            }),
        })

        notIn.push(metadataId)
    }

    await prisma.metadata.deleteMany({ where: { id: { notIn }, pageId } })

    const oldPage = await prisma.page.findUnique({ where: { id: pageId }, include: { slug: true } })
    const page = await prisma.page.update({
        where: { id: pageId },
        data: {
            name,
            published,
            slug:
                oldPage?.type === PageType.PAGE
                    ? {
                          update: {
                              full: slug.join('/'),
                              basic: slug.join('/'),
                              revalidatedAt: new Date(),
                          },
                      }
                    : undefined,
        },
        include: { slug: true, metadatas: { include: { values: true } } },
    })

    const locales =
        (
            await prisma.setting.findUnique({
                where: { type: SettingType.LANGUAGE_LOCALES },
            })
        )?.value.split(', ') || []

    if (oldPage?.slug && oldPage?.slug?.full !== slug.join('/')) {
        revalidatePath(page?.type === PageType.HOMEPAGE ? '/' : `/${oldPage?.slug.full as string}`)
        locales.forEach((e: string) =>
            revalidatePath(
                `/${e.toLocaleLowerCase()}${
                    page?.type === PageType.HOMEPAGE ? '' : `/${oldPage?.slug?.full}`
                }`
            )
        )
    }

    revalidatePath(page?.type === PageType.HOMEPAGE ? '/' : `/${slug.join('/')}`)
    locales.forEach((e) =>
        revalidatePath(`/${e.toLocaleLowerCase()}${page?.type === PageType.HOMEPAGE ? '/' : slug.join('/')}`)
    )

    return NextResponse.json(page)
}
