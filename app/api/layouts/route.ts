import { NextRequest, NextResponse } from 'next/server'
import { CodeLanguage, Section, SectionType, SettingType } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import { prisma } from '~/utilities/prisma'
import revalidateAllSlugs from '~/utilities/revalidateAllSlugs'

const sectionNames: {
    key: 'header' | 'topSidebar' | 'bottomSidebar' | 'topContent' | 'bottomContent' | 'footer'
    type: SectionType
}[] = [
    { key: 'header', type: SectionType.LAYOUT_HEADER },
    { key: 'topSidebar', type: SectionType.LAYOUT_SIDEBAR_TOP },
    { key: 'bottomSidebar', type: SectionType.LAYOUT_SIDEBAR_BOTTOM },
    { key: 'topContent', type: SectionType.LAYOUT_CONTENT_TOP },
    { key: 'bottomContent', type: SectionType.LAYOUT_CONTENT_BOTTOM },
    { key: 'footer', type: SectionType.LAYOUT_FOOTER },
]

export async function GET(_: NextRequest) {
    let layout: {
        header: Section[]
        topSidebar: Section[]
        bottomSidebar: Section[]
        topContent: Section[]
        bottomContent: Section[]
        footer: Section[]
    } = {
        header: [],
        topSidebar: [],
        bottomSidebar: [],
        topContent: [],
        bottomContent: [],
        footer: [],
    }

    for (const { key, type } of sectionNames) {
        layout[key] = await prisma.section.findMany({
            where: { type },
            orderBy: { position: 'asc' },
        })
    }

    return NextResponse.json(layout)
}

export async function PUT(request: NextRequest) {
    const newSections = (await request.json()) as {
        header: { [key in CodeLanguage]?: SectionCreationCleaned[] }
        topSidebar: { [key in CodeLanguage]?: SectionCreationCleaned[] }
        bottomSidebar: { [key in CodeLanguage]?: SectionCreationCleaned[] }
        topContent: { [key in CodeLanguage]?: SectionCreationCleaned[] }
        bottomContent: { [key in CodeLanguage]?: SectionCreationCleaned[] }
        footer: { [key in CodeLanguage]?: SectionCreationCleaned[] }
    }

    const locales = (
        await prisma.setting.findUnique({ where: { type: SettingType.LANGUAGE_LOCALES } })
    )?.value.split(', ') as CodeLanguage[]

    for (const option of sectionNames) {
        const notIn: string[] = []

        for (const lang of locales) {
            if (!newSections[option.key]?.[lang as CodeLanguage]) continue

            const sections = newSections[option.key]?.[lang as CodeLanguage] || []

            for (const section of sections) {
                if (section.id) {
                    await prisma.linkedToSection.deleteMany({
                        where: { sectionId: section.id },
                    })

                    const modified = await prisma.section.update({
                        where: { id: section.id },
                        data: {
                            position: parseInt(section.position as unknown as string),
                            value: section.value,

                            linkedData: {
                                createMany: {
                                    data: [
                                        ...section.medias.map((mediaId) => ({ mediaId })),
                                        ...section.forms.map((formId) => ({ formId })),
                                        ...section.links.map((linkId) => ({ linkId })),
                                        ...section.menus.map((menuId) => ({ menuId })),
                                    ],
                                },
                            },
                        },
                    })

                    notIn.push(modified.id)
                } else {
                    const created = await prisma.section.create({
                        data: {
                            language: lang as CodeLanguage,
                            type: option.type,
                            block: section.block,
                            position: parseInt(section.position as unknown as string),
                            value: section.value,

                            linkedData: {
                                createMany: {
                                    data: [
                                        ...section.medias.map((mediaId) => ({ mediaId })),
                                        ...section.forms.map((formId) => ({ formId })),
                                        ...section.links.map((linkId) => ({ linkId })),
                                        ...section.menus.map((menuId) => ({ menuId })),
                                    ],
                                },
                            },
                        },
                    })

                    notIn.push(created.id)
                }
            }
        }

        await prisma.section.deleteMany({
            where: { id: { notIn }, type: option.type },
        })
    }

    await revalidateAllSlugs()

    return NextResponse.json(newSections)
}
