import { SectionType } from '@prisma/client'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

const getProps = async (slug: string) => {
    const pageSections = await prisma.section.findMany({
        where: { page: { slug: { full: slug } }, type: SectionType.PAGE_SIDEBAR },
        orderBy: { position: 'asc' },
    })

    const contentSections = await prisma.section.findMany({
        where: { linkedContent: { slug: { full: slug } }, type: SectionType.CONTENT_SIDEBAR },
        orderBy: { position: 'asc' },
    })

    const containerTopSections = await prisma.section.findMany({
        where: { container: { slug: { full: slug } }, type: SectionType.TEMPLATE_SIDEBAR_TOP },
        orderBy: { position: 'asc' },
    })

    const containerBottomSections = await prisma.section.findMany({
        where: { container: { slug: { full: slug } }, type: SectionType.TEMPLATE_SIDEBAR_BOTTOM },
        orderBy: { position: 'asc' },
    })

    return [...containerTopSections, ...pageSections, ...contentSections, ...containerBottomSections]
}

const Sidebar = async ({ params }: { params: { slug: string } }) => {
    const sections = await getProps(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

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
