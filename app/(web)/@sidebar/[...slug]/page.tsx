import { SectionType } from '@prisma/client'
import { Suspense } from 'react'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

const getSections = async (slug: string) => {
    const exist = await prisma.slug.findFirst({
        where: { full: slug },
        include: {
            page: { select: { published: true } },
            container: { select: { published: true } },
            content: { select: { containerId: true, published: true } },
        },
    })

    if (!exist) return null

    if (!!exist.pageId && exist.page?.published) {
        const pageSections = await prisma.section.findMany({
            where: { pageId: exist.pageId, type: SectionType.PAGE_SIDEBAR },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        return pageSections
    } else if (!!exist.containerId && exist.container?.published) {
        const containerSections = await prisma.section.findMany({
            where: { containerId: exist.containerId, type: SectionType.CONTAINER_SIDEBAR },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        return containerSections
    } else if (!!exist.contentId && exist.content?.published) {
        const contentSections = await prisma.section.findMany({
            where: { contentId: exist.contentId, type: SectionType.CONTENT_SIDEBAR },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        const containerTopSections = await prisma.section.findMany({
            where: { containerId: exist.content.containerId, type: SectionType.TEMPLATE_SIDEBAR_TOP },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        const containerBottomSections = await prisma.section.findMany({
            where: { containerId: exist.content.containerId, type: SectionType.TEMPLATE_SIDEBAR_BOTTOM },
            include: {
                medias: {
                    include: {
                        media: true,
                        form: { include: { fields: true } },
                        link: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })

        return [...containerTopSections, ...contentSections, ...containerBottomSections]
    }

    return null
}

const Sidebar = async ({ params }: { params: { slug: string } }) => {
    const sections = await getSections(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

    if (sections === null) return null

    return (
        <>
            {sections.map((section) => (
                <Suspense key={section.id}>
                    {/* @ts-expect-error Server Component */}
                    <DisplaySection section={section} />
                </Suspense>
            ))}
        </>
    )
}

export const revalidate = 'force-cache'

export default Sidebar
