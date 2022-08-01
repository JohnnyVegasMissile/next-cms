import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
import { prisma } from '../utils/prisma'
import EditPageButton from '../components/EditPageButton'
import { PageProps } from 'types'
import get from 'lodash.get'

const NotFound = (props: PageProps) => {
    const { title } = props

    return (
        <div>
            <Head>
                <title>{title}</title>
                {/* <title>{title}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))} */}
            </Head>

            <EditPageButton redirectTo={`/admin/pages/${'id'}`} />

            {/* <header>{!!header && <SectionBlock section={header} page={props} />}</header>

            <main>
                {sections?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} />
                ))}
            </main>

            <footer>{!!footer && <SectionBlock section={footer} page={props} />}</footer> */}
        </div>
    )
}

const sanitizeDate = (date: Date) => (!!date ? Math.floor((date?.getMilliseconds() || 1) / 1000) : undefined)

export async function getStaticProps(context: GetStaticPathsContext) {
    const pageSlug = await prisma.slug.findUnique({
        where: { fullSlug: 'not-found' },
        include: {
            content: {
                include: {
                    metadatas: true,
                    accesses: true,
                    sections: { include: { form: true } },
                    fields: true,
                    container: {
                        include: {
                            contentSections: {
                                include: { form: true },
                            },
                        },
                    },
                },
            },
        },
    })

    const props = {
        type: 'content',
        ...get(pageSlug, 'content', {}),
        updatedAt: sanitizeDate(get(pageSlug, 'content.updatedAt', undefined)),
    }

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    return {
        props,
        revalidate: revalidate ? parseInt(revalidate.value) : 60,
    }
}

export default NotFound
