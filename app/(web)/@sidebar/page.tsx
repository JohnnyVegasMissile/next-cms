import { PageType, SectionType } from '@prisma/client'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    const sections = await prisma.section.findMany({
        where: { page: { type: PageType.HOMEPAGE }, type: SectionType.PAGE_SIDEBAR },
        orderBy: { position: 'asc' },
    })

    return sections
}

const HomeSidebar = async () => {
    const sections = await getProps()

    return (
        <>
            {sections.map((section) => (
                <DisplaySection key={section.id} section={section} />
            ))}
        </>
    )
}

export const revalidate = 'force-cache'
export default HomeSidebar
