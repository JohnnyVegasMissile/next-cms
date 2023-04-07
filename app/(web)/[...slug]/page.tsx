import QuickEditButton from '~/components/QuickEditButton'
import { prisma } from '~/utilities/prisma'
import Sidebar from '~/components/Sidebar'
import { Suspense } from 'react'
import Content from '~/components/Content'
import { notFound } from 'next/navigation'

const getProps = async (slug: string) => {
    const page = await prisma.page.findFirst({
        where: { slug: { full: slug } },
    })

    return { page }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { page } = await getProps(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

    return {
        title: page?.name,
    }
}

const Home = async ({ params }: { params: { slug: string } }) => {
    const { page } = await getProps(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

    if (!page) notFound()

    return (
        <>
            <QuickEditButton />
            <Suspense>
                {/* @ts-expect-error Server Component */}
                <Sidebar id={page!.id} type="page" />
            </Suspense>
            <Suspense>
                {/* @ts-expect-error Server Component */}
                <Content id={page!.id} type="page" />
            </Suspense>
        </>
    )
}

export const revalidate = 'force-cache'
export default Home
