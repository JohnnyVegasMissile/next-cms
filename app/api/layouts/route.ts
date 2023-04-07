// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { Section, SectionType } from '@prisma/client'
import { SectionCreationCleaned } from '~/types/sectionCreation'
import { prisma } from '~/utilities/prisma'

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

    // NextResponse extends the Web Response API
    return NextResponse.json(layout)
}

export async function PUT(request: NextRequest) {
    const newSections = (await request.json()) as {
        header: SectionCreationCleaned[]
        topSidebar: SectionCreationCleaned[]
        bottomSidebar: SectionCreationCleaned[]
        topContent: SectionCreationCleaned[]
        bottomContent: SectionCreationCleaned[]
        footer: SectionCreationCleaned[]
    }

    for (const { key, type } of sectionNames) {
        const content: Section[] = []

        for (const section of newSections[key]) {
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
                        type,
                        block: section.block,
                        position: section.position,
                        content: section.content,
                    },
                })

                content.push(created)
            }
        }

        await prisma.section.deleteMany({
            where: { id: { notIn: content.map((e) => e.id) }, type },
        })
    }

    // NextResponse extends the Web Response API
    return NextResponse.json(newSections)
}
