import { PageType, SectionType } from '@prisma/client'
import DefaultSection from '~/components/DefaultSection'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    const sections = await prisma.section.findMany({
        where: { page: { type: PageType.HOMEPAGE }, type: SectionType.PAGE },
        orderBy: { position: 'asc' },
    })

    return sections
}

const Home = async () => {
    const sections = await getProps()

    if (!sections.length) return <DefaultSection.Homepage />

    return (
        <>
            {sections.map((section) => (
                <DisplaySection key={section.id} section={section} />
            ))}
        </>
    )
}

export const revalidate = 'force-cache'
export default Home
