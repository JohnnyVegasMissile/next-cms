import { PageType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/utilities/prisma'

export async function POST(_: NextRequest, context: any) {
    const { pageId } = context.params

    const page = await prisma.page.findUnique({ where: { id: pageId }, include: { slug: true } })

    if (
        !page ||
        page.type === PageType.NOTFOUND ||
        page.type === PageType.ERROR ||
        page.type === PageType.MAINTENANCE
    )
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })

    const newPage = await prisma.page.create({
        data: {
            name: page.name,
            type: PageType.PAGE,
            published: false,
            // slug: {
            //     create: {
            //         basic: `${page.slug!.basic || 'homepage'}-copy`,
            //         full: `${page.slug!.full || 'homepage'}-copy`,
            //     },
            // },
        },
    })

    let count = 1
    while (true) {
        const exist = await prisma.slug.findUnique({
            where: { full: `${page.slug!.full || 'homepage'} (${count})` },
        })

        if (!exist) {
            await prisma.slug.create({
                data: {
                    pageId: newPage.id!,
                    basic: `${page.slug!.basic || 'homepage'} (${count})`,
                    full: `${page.slug!.full || 'homepage'} (${count})`,
                },
            })
            break
        }

        count++
    }

    const metadatas = await prisma.metadata.findMany({ where: { pageId }, include: { values: true } })

    const sections = await prisma.section.findMany({ where: { pageId }, include: { linkedData: true } })

    for (const section of sections) {
        await prisma.section.create({
            data: {
                type: section.type,
                block: section.block,
                position: section.position,
                language: section.language,

                value: section.value || {},
                pageId: newPage.id!,
            },
        })
    }

    return NextResponse.json(newPage)
}
