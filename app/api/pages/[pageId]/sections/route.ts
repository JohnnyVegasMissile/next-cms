import { NextRequest, NextResponse } from 'next/server'
import { CodeLanguage, PageType, Section, SectionType } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'

export async function PUT(request: NextRequest, context: any) {
    const { pageId } = context.params
    const newSections = (await request.json()) as {
        content: { [key in CodeLanguage]?: SectionCreationCleaned[] }
        sidebar: { [key in CodeLanguage]?: SectionCreationCleaned[] }
    }

    const content: Section[] = []
    Object.keys(newSections.content).forEach(async (lang) => {
        const sections = newSections.content?.[lang as CodeLanguage] || []

        for (const section of sections) {
            if (section.id) {
                await prisma.linkedToSection.deleteMany({
                    where: { sectionId: section.id },
                })

                const modified = await prisma.section.update({
                    where: {
                        id: section.id,
                    },
                    data: {
                        position: parseInt(section.position as unknown as string),
                        content: section.value,

                        linkedData: {
                            createMany: {
                                data: [
                                    ...section.medias.map((mediaId) => ({ mediaId })),
                                    ...section.forms.map((formId) => ({ formId })),
                                ],
                            },
                        },
                    },
                })

                content.push(modified)
            } else {
                const created = await prisma.section.create({
                    data: {
                        pageId,
                        language: lang as CodeLanguage,
                        type: SectionType.PAGE,
                        block: section.block,
                        position: parseInt(section.position as unknown as string),
                        value: section.value,

                        linkedData: {
                            createMany: {
                                data: [
                                    ...section.medias.map((mediaId) => ({ mediaId })),
                                    ...section.forms.map((formId) => ({ formId })),
                                ],
                            },
                        },
                    },
                })

                content.push(created)
            }
        }
    })

    const sidebar: Section[] = []
    Object.keys(newSections.content).forEach(async (lang) => {
        const sections = newSections.content?.[lang as CodeLanguage] || []

        for (const section of sections) {
            if (section.id) {
                await prisma.linkedToSection.deleteMany({
                    where: { sectionId: section.id },
                })

                const modified = await prisma.section.update({
                    where: {
                        id: section.id,
                    },
                    data: {
                        position: parseInt(section.position as unknown as string),
                        content: section.value,

                        linkedData: {
                            createMany: {
                                data: [
                                    ...section.medias.map((mediaId) => ({ mediaId })),
                                    ...section.forms.map((formId) => ({ formId })),
                                ],
                            },
                        },
                    },
                })

                sidebar.push(modified)
            } else {
                const created = await prisma.section.create({
                    data: {
                        pageId,
                        language: lang as CodeLanguage,
                        type: SectionType.PAGE_SIDEBAR,
                        block: section.block,
                        position: parseInt(section.position as unknown as string),
                        value: section.value,

                        linkedData: {
                            createMany: {
                                data: [
                                    ...section.medias.map((mediaId) => ({ mediaId })),
                                    ...section.forms.map((formId) => ({ formId })),
                                ],
                            },
                        },
                    },
                })

                sidebar.push(created)
            }
        }
    })

    await prisma.section.deleteMany({
        where: {
            id: { notIn: [...content, ...sidebar].map((e) => e.id) },
            pageId,
        },
    })

    const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: { slug: true },
    })

    switch (page?.type) {
        case PageType.HOMEPAGE: {
            revalidatePath('/')
            break
        }
        case PageType.PAGE: {
            if (page?.slug) revalidatePath(`/${page?.slug.full as string}`)

            await prisma.slug.update({
                where: { pageId },
                data: { revalidatedAt: new Date() },
            })

            break
        }
    }

    // NextResponse extends the Web Response API
    return NextResponse.json({ content, sidebar })
}
