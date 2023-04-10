import { Suspense } from 'react'
import { PageType } from '@prisma/client'
import QuickEditButton from '~/components/QuickEditButton'
import { prisma } from '~/utilities/prisma'
import Sidebar from '~/components/Sidebar'
import Content from '~/components/Content'

const getProps = async () => {
    const page = await prisma.page.findFirst({
        where: { type: PageType.HOMEPAGE },
    })

    return page
}

const Home = async () => {
    const page = await getProps()

    return (
        <>
            <QuickEditButton />
            <Suspense>
                {/* @ts-expect-error Server Component */}
                <Sidebar id={page!.id} type="page" />
            </Suspense>
            <Suspense>
                {/* @ts-expect-error Server Component */}
                <Content id={page!.id} type="page" fallback={<>Sign in</>} />
            </Suspense>
        </>
    )
}

export const revalidate = 'force-cache'
export default Home
