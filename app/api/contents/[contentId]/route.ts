/* eslint-disable @next/next/no-server-import-in-page */
import { ContentField } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'
import { ObjectId } from '~/types'
import ContentCreation from '~/types/contentCreation'
import { prisma } from '~/utilities/prisma'

export async function GET(_: NextRequest, context: any) {
    const { contentId } = context.params

    const content = await prisma.content.findUnique({
        where: { id: contentId },
        include: { slug: true, metadatas: true, fields: true },
    })

    if (!content) NextResponse.json({ message: "Page doesn't exist" }, { status: 404 })

    // NextResponse extends the Web Response API
    return NextResponse.json(content)
}

export async function PUT(request: Request, context: any) {
    const { contentId } = context.params
    const { name, slug, published, metadatas, fields } = (await request.json()) as ContentCreation<Date>

    if (typeof name !== 'string') return NextResponse.json({ message: 'Name not valid' }, { status: 400 })
    if (typeof slug !== 'string') return NextResponse.json({ message: 'Slug not valid.' }, { status: 400 })
    if (typeof published !== 'boolean')
        return NextResponse.json({ message: 'Published not valid' }, { status: 400 })

    const listID = metadatas?.map((metadata) => metadata.id)?.filter((id) => !!id)

    await prisma.metadata.deleteMany({
        where: { id: { notIn: listID as ObjectId[] } },
    })

    for (const metadata of metadatas) {
        if (!!metadata.id) {
            await prisma.metadata.update({
                where: { id: metadata.id },
                data: {
                    content: metadata.content,
                    name: metadata.name,
                },
            })
        } else {
            await prisma.metadata.create({
                data: {
                    linkedContentId: contentId,
                    content: metadata.content,
                    name: metadata.name,
                },
            })
        }
    }

    const updatedFields: ContentField[] = []

    await prisma.contentField.deleteMany({ where: { contentId } })

    for (const field of fields) {
        const created = await prisma.contentField.create({
            data: { ...field, contentId },
        })

        updatedFields.push(created)
    }

    const actualContent = await prisma.content.findUnique({
        where: { id: contentId },
        include: { container: { include: { slug: true } } },
    })

    const content = await prisma.content.update({
        where: { id: contentId },
        data: {
            name,
            published,
            slug: {
                update: {
                    full: `${actualContent?.container.slug?.full}/${slug}`,
                    basic: slug,
                },
            },
        },
        include: { slug: true, metadatas: true, fields: true },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(content)
}
