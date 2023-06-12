/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse, NextRequest } from 'next/server'
import { ObjectId } from '~/types'
import PageCreation from '~/types/pageCreation'
import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'
import { PageType } from '@prisma/client'

export async function GET(_: NextRequest, context: any) {
    const { pageId } = context.params

    const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: { slug: true, metadatas: true },
    })

    if (!page) NextResponse.json({ message: "Container doesn't exist" }, { status: 404 })

    // NextResponse extends the Web Response API
    return NextResponse.json(page)
}

export async function PUT(request: Request, context: any) {
    const { pageId } = context.params
    const { name, slug, published, metadatas } = (await request.json()) as PageCreation

    if (typeof name !== 'string') NextResponse.json({ message: 'Name not valid' }, { status: 400 })
    if (!Array.isArray(slug)) NextResponse.json({ message: 'Slug not valid.' }, { status: 400 })
    if (typeof published !== 'boolean') NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const listID = metadatas?.map((metadata) => metadata.id)?.filter((id) => !!id)

    await prisma.metadata.deleteMany({
        where: { id: { notIn: listID as ObjectId[] } },
    })

    for (const metadata of metadatas) {
        if (!!metadata.id) {
            await prisma.metadata.update({
                where: { id: metadata.id },
                data: {
                    content: Array.isArray(metadata.content) ? metadata.content.join(', ') : metadata.content,
                    name: metadata.name,
                },
            })
        } else {
            await prisma.metadata.create({
                data: {
                    linkedPageId: pageId,
                    content: Array.isArray(metadata.content) ? metadata.content.join(', ') : metadata.content,
                    name: metadata.name,
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
            slug: {
                update: {
                    full: slug.join('/'),
                    basic: slug.join('/'),
                    revalidatedAt: new Date(),
                },
            },
        },
        include: { slug: true, metadatas: true },
    })

    switch (page?.type) {
        case PageType.HOMEPAGE: {
            revalidatePath('/')
            break
        }
        case PageType.HOMEPAGE: {
            revalidatePath('/sign-in')
            break
        }
        case PageType.PAGE: {
            if (oldPage?.slug && oldPage?.slug?.full !== slug.join('/'))
                revalidatePath(`/${oldPage?.slug.full as string}`)

            revalidatePath(`/${slug.join('/')}`)
            break
        }
    }

    // NextResponse extends the Web Response API
    return NextResponse.json(page)
}
