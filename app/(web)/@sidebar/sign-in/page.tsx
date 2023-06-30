import { PageType, SectionType } from '@prisma/client'
import { Suspense } from 'react'
import DisplaySection from '~/components/DisplaySection'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    const sections = await prisma.section.findMany({
        where: { page: { type: PageType.SIGNIN }, type: SectionType.PAGE_SIDEBAR },
        orderBy: { position: 'asc' },
    })

    return sections
}

const SignInSidebar = async () => {
    const sections = await getProps()

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
