import { PageType, SectionType } from '@prisma/client'
import { Suspense } from 'react'
import DefaultSection from '~/components/DefaultSection'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

export async function generateMetadata() {
    const page = await prisma.page.findFirst({
        where: { type: PageType.SIGNIN },
    })

    return { title: page?.name || '' }
}

const getProps = async () => {
    const sections = await prisma.section.findMany({
        where: { page: { type: PageType.SIGNIN }, type: SectionType.PAGE },
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

    return sections
}

const SignInSidebar = async () => {
    const sections = await getProps()

    if (!sections.length) return <DefaultSection.SignIn />

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

export default SignInSidebar
