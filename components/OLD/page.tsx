import { PageType, SectionType } from '@prisma/client'
import { Suspense } from 'react'
import DefaultSection from '~/components/DefaultSection'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

export async function generateMetadata() {
    const page = await prisma.page.findFirst({
        where: { type: PageType.HOMEPAGE },
    })

    return { title: page?.name || '' }
}

const getProps = async () => {
    const sections = await prisma.section.findMany({
        where: { page: { type: PageType.HOMEPAGE }, type: SectionType.PAGE },
        include: {
            linkedData: {
                include: {
                    media: true,
                    form: { include: { fields: true } },
                    link: { include: { slug: true } },
                    menu: {
                        include: {
                            childs: {
                                include: {
                                    childs: {
                                        include: {
                                            childs: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
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
                <Suspense key={section.id}>
                    <DisplaySection section={section} />
                </Suspense>
            ))}
        </>
    )
}

export const revalidate = Infinity

export default Home
