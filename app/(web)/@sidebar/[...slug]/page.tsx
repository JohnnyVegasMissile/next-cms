import { SectionType } from '@prisma/client'
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
            orderBy: { position: 'asc' },
        })

        return pageSections
    } else if (!!exist.containerId && exist.container?.published) {
        const containerSections = await prisma.section.findMany({
            where: { containerId: exist.containerId, type: SectionType.CONTAINER_SIDEBAR },
            orderBy: { position: 'asc' },
        })

        return containerSections
    } else if (!!exist.contentId && exist.content?.published) {
        const contentSections = await prisma.section.findMany({
            where: { contentId: exist.contentId, type: SectionType.CONTENT_SIDEBAR },
            orderBy: { position: 'asc' },
        })

        const containerTopSections = await prisma.section.findMany({
            where: { containerId: exist.content.containerId, type: SectionType.TEMPLATE_SIDEBAR_TOP },
            orderBy: { position: 'asc' },
        })

        const containerBottomSections = await prisma.section.findMany({
            where: { containerId: exist.content.containerId, type: SectionType.TEMPLATE_SIDEBAR_BOTTOM },
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
                <DisplaySection key={section.id} section={section} />
            ))}
        </>
    )
}

export const revalidate = 'force-cache'

export default Sidebar
