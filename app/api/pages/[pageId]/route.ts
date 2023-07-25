import { CodeLanguage, LinkType, PageType, SettingType } from '@prisma/client'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import PageCreation, { CreationMetadata } from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'
import languages from '~/utilities/languages'

export async function PUT(request: Request, context: any) {
    const { pageId } = context.params
    const { name, slug, published, metadatas } = (await request.json()) as PageCreation

    if (typeof name !== 'string') NextResponse.json({ message: 'Name not valid' }, { status: 400 })
    if (!Array.isArray(slug)) NextResponse.json({ message: 'Slug not valid.' }, { status: 400 })
    if (typeof published !== 'boolean') NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const notIn: string[] = []

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
                    data: { types: metadata.types, pageId, language: metadata.language },
                })
            )?.id
        }

        await prisma.metadataValue.createMany({
            data: metadata.values.map((value) => {
                if (typeof value === 'string') {
                    return { metadataId: metadataId!, string: value }
                } else if (typeof value === 'number') {
                    return { metadataId: metadataId!, number: value }
                } else if (typeof value === 'boolean') {
                    return { metadataId: metadataId!, boolean: value }
                } else if (value?.type === 'IN') {
                    return {
                        metadataId: metadataId!,
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
                        metadataId: metadataId!,
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
                        metadataId: metadataId!,
                        mediaId: value?.id,
                    }
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

export async function DELETE(_: Request, context: any) {
    const { pageId } = context.params

    const page = await prisma.page.findUnique({ where: { id: pageId }, include: { slug: true } })

    if (!page) return NextResponse.json({ message: 'Page not found' }, { status: 404 })

    if (page.type !== PageType.PAGE) return NextResponse.json({ message: 'Page not deletable' }, { status: 400 })

    await prisma.page.delete({ where: { id: pageId } })

    const setting = await prisma.setting.findUnique({ where: { type: SettingType.LANGUAGE_LOCALES } })
    const locales = setting?.value.split(', ') || []

    revalidatePath(`/${page.slug?.full}`)
    for (const locale of locales) {
        revalidatePath(`/${languages[locale as CodeLanguage].code}/${page.slug?.full}`)
    }

    return NextResponse.json({ message: 'Page deleted' })
}