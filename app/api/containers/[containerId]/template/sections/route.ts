// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { Section, SectionType } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'

export async function PUT(request: NextRequest, context: any) {
    const { containerId } = context.params
    const newSections = (await request.json()) as {
        contentTop: SectionCreationCleaned[]
        contentBottom: SectionCreationCleaned[]
        sidebarTop: SectionCreationCleaned[]
        sidebarBottom: SectionCreationCleaned[]
    }

    const contentTop: Section[] = []

    for (const section of newSections.contentTop) {
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

            contentTop.push(modified)
        } else {
            const created = await prisma.section.create({
                data: {
                    containerId,
                    type: SectionType.TEMPLATE_TOP,
                    block: section.block,
                    position: section.position,
                    content: section.content,
                },
            })

            contentTop.push(created)
        }
    }

    const contentBottom: Section[] = []

    for (const section of newSections.contentBottom) {
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

            contentBottom.push(modified)
        } else {
            const created = await prisma.section.create({
                data: {
                    containerId,
                    type: SectionType.TEMPLATE_BOTTOM,
                    block: section.block,
                    position: section.position,
                    content: section.content,
                },
            })

            contentBottom.push(created)
        }
    }

    const sidebarTop: Section[] = []

    for (const section of newSections.sidebarTop) {
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

            sidebarTop.push(modified)
        } else {
            const created = await prisma.section.create({
                data: {
                    containerId,
                    type: SectionType.TEMPLATE_SIDEBAR_TOP,
                    block: section.block,
                    position: section.position,
                    content: section.content,
                },
            })

            sidebarTop.push(created)
        }
    }

    const sidebarBottom: Section[] = []

    for (const section of newSections.sidebarBottom) {
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

            sidebarBottom.push(modified)
        } else {
            const created = await prisma.section.create({
                data: {
                    containerId,
                    type: SectionType.TEMPLATE_SIDEBAR_BOTTOM,
                    block: section.block,
                    position: section.position,
                    content: section.content,
                },
            })

            sidebarBottom.push(created)
        }
    }

    await prisma.section.deleteMany({
        where: {
            id: {
                notIn: [...contentTop, ...contentBottom, ...sidebarTop, ...sidebarBottom].map((e) => e.id),
            },
            type: {
                in: [
                    SectionType.TEMPLATE_TOP,
                    SectionType.TEMPLATE_BOTTOM,
                    SectionType.TEMPLATE_SIDEBAR_TOP,
                    SectionType.TEMPLATE_SIDEBAR_BOTTOM,
                ],
            },
            containerId,
        },
    })

    const container = await prisma.container.findUnique({
        where: { id: containerId },
        include: {
            slug: true,
            contents: { include: { slug: true } },
        },
    })

    if (container?.slug) revalidatePath(`/${container?.slug.full as string}`)

    await prisma.slug.update({
        where: { containerId },
        data: { revalidatedAt: new Date() },
    })

    container?.contents.forEach(async (content) => {
        if (content?.slug) revalidatePath(`/${content?.slug.full as string}`)

        await prisma.slug.update({
            where: { contentId: content?.id },
            data: { revalidatedAt: new Date() },
        })
    })

    // NextResponse extends the Web Response API
    return NextResponse.json({ contentTop, contentBottom, sidebarTop, sidebarBottom })
}
