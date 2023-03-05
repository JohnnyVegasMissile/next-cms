import { prisma } from '~/utilities/prisma'
import { notFound } from 'next/navigation'
import TextBlock from '~/blocks/TextBlock'

const getProps = async (slug: string) => {
    return await prisma.page.findFirst({
        where: { slug: { full: slug } },
    })
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const page = await getProps(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

    return {
        title: page?.name,
    }
}

const Page = async ({ params }: { params: { slug: string } }) => {
    const page = await getProps(Array.isArray(params.slug) ? params.slug.join('/') : params.slug)

    if (!page) notFound()

    return (
        <div>
            {Array.isArray(params.slug) ? params.slug.join('/') : params.slug} <TextBlock />
        </div>
    )
}

export const revalidate = 'force-cache'
export default Page
