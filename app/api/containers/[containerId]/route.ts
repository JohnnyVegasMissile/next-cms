/* eslint-disable @next/next/no-server-import-in-page */
import { ContainerField } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'
import { ObjectId } from '~/types'
import ContainerCreation from '~/types/containerCreation'
import { prisma } from '~/utilities/prisma'

export async function GET(_: NextRequest, context: any) {
    const { containerId } = context.params

    const page = await prisma.container.findUnique({
        where: { id: parseInt(containerId) },
        include: { slug: true, metadatas: true, fields: true },
    })

    if (!page) NextResponse.json({ message: "Page doesn't exist" }, { status: 404 })

    // NextResponse extends the Web Response API
    return NextResponse.json(page)
}

export async function PUT(request: Request, context: any) {
    const { containerId } = context.params
    const { name, slug, published, metadatas, fields } = (await request.json()) as ContainerCreation<Date>

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
                    linkedPageId: parseInt(containerId),
                    content: Array.isArray(metadata.content) ? metadata.content.join(', ') : metadata.content,
                    name: metadata.name,
                },
            })
        }
    }

    const updatedFields: ContainerField[] = []

    for (const field of fields) {
        if (field.id) {
            const modified = await prisma.containerField.update({
                where: {
                    id: parseInt(field.id as unknown as string),
                },
                data: field,
            })

            updatedFields.push(modified)
        } else {
            const created = await prisma.containerField.create({
                data: { ...field, containerId: parseInt(containerId) },
            })

            updatedFields.push(created)
        }
    }

    await prisma.containerField.deleteMany({
        where: { id: { notIn: [...updatedFields].map((e) => e.id) }, containerId },
    })

    const container = await prisma.container.update({
        where: { id: parseInt(containerId) },
        data: {
            name,
            published,
            slug: {
                update: {
                    full: slug.join('/'),
                    basic: slug.join('/'),
                },
            },
        },
        include: { slug: true, metadatas: true, fields: true },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json(container)
}
