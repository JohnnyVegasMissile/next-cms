// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { Section, SectionType } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'

export async function GET(_: NextRequest, context: any) {
    const { pageId } = context.params

    const content = await prisma.section.findMany({
        where: { pageId, type: SectionType.PAGE },
        orderBy: { position: 'asc' },
    })

    const sidebar = await prisma.section.findMany({
        where: { pageId, type: SectionType.PAGE_SIDEBAR },
        orderBy: { position: 'asc' },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json({ content, sidebar })
}

export async function PUT(request: NextRequest, context: any) {
    const { contentId } = context.params
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
                    contentId,
                    type: SectionType.CONTENT,
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
                    contentId,
                    type: SectionType.CONTENT_SIDEBAR,
                    block: section.block,
                    position: section.position,
                    content: section.content,
                },
            })

            sidebar.push(created)
        }
    }

    await prisma.section.deleteMany({
        where: { id: { notIn: [...content, ...sidebar].map((e) => e.id) }, contentId },
    })

    const cnt = await prisma.content.findUnique({
        where: { id: contentId },
        include: { slug: true },
    })

    if (cnt?.slug) revalidatePath(`/${cnt?.slug.full as string}`)

    await prisma.slug.update({
        where: { contentId },
        data: { revalidatedAt: new Date() },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json({ content })
}
