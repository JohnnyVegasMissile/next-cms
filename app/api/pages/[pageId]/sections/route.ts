import { NextRequest, NextResponse } from 'next/server'
import { CodeLanguage, PageType, SectionType, SettingType } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import { prisma } from '~/utilities/prisma'
import { revalidatePath } from 'next/cache'
import languages from '~/utilities/languages'

export async function PUT(request: NextRequest, context: any) {
    const { pageId } = context.params
    const newSections = (await request.json()) as {
        content: { [key in CodeLanguage]?: SectionCreationCleaned[] }
        sidebar: { [key in CodeLanguage]?: SectionCreationCleaned[] }
    }

    const page = await prisma.page.findUnique({
        where: { id: pageId },
        include: { slug: true },
    })

    if (!page) return NextResponse.json({ message: 'Not found' }, { status: 404 })

    const locales = (
        await prisma.setting.findUnique({ where: { type: SettingType.LANGUAGE_LOCALES } })
    )?.value.split(', ') as CodeLanguage[]

    const notIn: string[] = []

    const options: { key: 'content' | 'sidebar'; type: SectionType }[] = [
        { key: 'content', type: SectionType.PAGE },
        { key: 'sidebar', type: SectionType.PAGE_SIDEBAR },
    ]

    for (const option of options) {
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
                            pageId,
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
    }

    await prisma.section.deleteMany({ where: { id: { notIn }, pageId } })

    switch (page?.type) {
        case PageType.HOMEPAGE: {
            revalidatePath('/')
            locales.forEach((locale) => revalidatePath(`/${languages[locale].code}`))
            break
        }
        case PageType.PAGE: {
            if (!!page?.slug) {
                revalidatePath(`/${page?.slug.full as string}`)
                locales.forEach((locale) =>
                    revalidatePath(`/${languages[locale].code}/${page?.slug!.full as string}`)
                )
            }

            break
        }
    }

    await prisma.slug.update({
        where: { pageId },
        data: { revalidatedAt: new Date() },
    })

    // NextResponse extends the Web Response API
    return NextResponse.json({ success: true })
}
