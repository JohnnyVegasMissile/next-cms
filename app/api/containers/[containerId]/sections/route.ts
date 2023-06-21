// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { Section, SectionType } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'

export async function PUT(request: NextRequest, context: any) {
    const { containerId } = context.params
    const newSections = (await request.json()) as {
        content: SectionCreationCleaned[]
        sidebar: SectionCreationCleaned[]
    }

    const content: Section[] = []

    for (const section of newSections.content) {
        if (section.id) {
            const modified = await prisma.section.update({
                where: {
                    id: section.id,
                },
                data: {
                    position: section.position,
                    content: section.content,
                },
            })

            content.push(modified)
        } else {
            const created = await prisma.section.create({
                data: {
                    containerId,
                    type: SectionType.CONTAINER,
                    block: section.block,
                    position: section.position,
                    content: section.content,
                },
            })

            content.push(created)
        }
    }

    const sidebar: Section[] = []

    for (const section of newSections.sidebar) {
        if (section.id) {
            const modified = await prisma.section.update({
                where: {
                    id: section.id,
                },
                data: {
                    position: section.position,
                    content: section.content,
                },
            })

            sidebar.push(modified)
        } else {
            const created = await prisma.section.create({
                data: {
                    containerId,
                    type: SectionType.CONTAINER_SIDEBAR,
                    block: section.block,
                    position: section.position,
                    content: section.content,
                },
            })

            sidebar.push(created)
        }
    }

    await prisma.section.deleteMany({
        where: {
            id: { notIn: [...content, ...sidebar].map((e) => e.id) },
            type: {
                in: [SectionType.CONTAINER, SectionType.CONTAINER_SIDEBAR],
            },
            containerId,
        },
    })

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: { slug: true },
    })

    if (container?.slug) revalidatePath(`/${container?.slug.full as string}`)

    await prisma.slug.update({
        where: { containerId },
        data: { revalidatedAt: new Date() },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json({ content, sidebar })
}
