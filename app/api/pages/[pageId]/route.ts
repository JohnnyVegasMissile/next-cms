import { LinkProtocol, LinkType, Media, MediaType, PageType, SettingType } from '@prisma/client'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import PageCreation from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'
import { ObjectId } from '~/types'
import { LinkValue } from '~/components/LinkSelect'

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

export async function PUT(request: Request, context: any) {
    const { pageId } = context.params
    const { name, slug, published, metadatas } = (await request.json()) as PageCreation

    if (typeof name !== 'string') NextResponse.json({ message: 'Name not valid' }, { status: 400 })
    if (!Array.isArray(slug)) NextResponse.json({ message: 'Slug not valid.' }, { status: 400 })
    if (typeof published !== 'boolean') NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const listID = metadatas?.map((metadata) => metadata.id)?.filter((id) => !!id)

    await prisma.metadata.deleteMany({
        where: { id: { notIn: listID as ObjectId[] }, pageId },
    })

    for (const metadata of metadatas) {
        if (!!metadata.id) {
            await prisma.metadataValue.deleteMany({ where: { metadataId: metadata.id } })
            await prisma.metadata.update({
                where: { id: metadata.id },
                data: {
                    types: metadata.types,
                    values: parseCreateValues(metadata.values),
                },
            })
        } else {
            await prisma.metadata.create({
                data: {
                    pageId,
                    types: metadata.types,
                    values: parseCreateValues(metadata.values),
                },
            })
        }
    }

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
        include: { slug: true, metadatas: true },
    })

    const locales =
        (
            await prisma.setting.findUnique({
                where: { type: SettingType.LANGUAGE_LOCALES },
            })
        )?.value.split(', ') || []

    switch (page?.type) {
        case PageType.HOMEPAGE: {
            revalidatePath('/')
            locales.forEach((e) => revalidatePath(`/${e.toLocaleLowerCase()}`))
            break
        }
        case PageType.SIGNIN: {
            revalidatePath('/sign-in')
            locales.forEach((e) => revalidatePath(`/${e.toLocaleLowerCase()}/sign-in`))
            break
        }
        case PageType.PAGE: {
            if (oldPage?.slug && oldPage?.slug?.full !== slug.join('/')) {
                revalidatePath(`/${oldPage?.slug.full as string}`)
                locales.forEach((e) =>
                    revalidatePath(`/${e.toLocaleLowerCase()}/${oldPage?.slug?.full as string}`)
                )
            }

            revalidatePath(`/${slug.join('/')}`)
            locales.forEach((e) => revalidatePath(`/${e.toLocaleLowerCase()}/${slug.join('/')}`))
            break
        }
    }

    return NextResponse.json(page)
}
