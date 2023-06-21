// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { PageType, Section, SectionType } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'

export async function PUT(request: NextRequest, context: any) {
    const { pageId } = context.params
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
                    position: parseInt(section.position as unknown as string),
                    content: section.content,
                },
            })

            content.push(modified)
        } else {
            const created = await prisma.section.create({
                data: {
                    pageId,
                    type: SectionType.PAGE,
                    block: section.block,
                    position: parseInt(section.position as unknown as string),
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
                    position: parseInt(section.position as unknown as string),
                    content: section.content,
                },
            })

            sidebar.push(modified)
        } else {
            const created = await prisma.section.create({
                data: {
                    pageId,
                    type: SectionType.PAGE_SIDEBAR,
                    block: section.block,
                    position: parseInt(section.position as unknown as string),
                    content: section.content,
                },
            })

            sidebar.push(created)
        }
    }

    await prisma.section.deleteMany({
        where: {
            id: { notIn: [...content, ...sidebar].map((e) => e.id) },
            pageId,
        },
    })

    const page = await prisma.page.findUnique({
        where: {
            id: pageId,
        },
        include: {
            slug: true,
        },
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
            if (page?.slug) revalidatePath(`/${page?.slug.full as string}`)

            await prisma.slug.update({
                where: {
                    pageId,
                },
                data: {
                    revalidatedAt: new Date(),
                },
            })

            break
        }
    }

    // NextResponse extends the Web Response API
    return NextResponse.json({ content, sidebar })
}
