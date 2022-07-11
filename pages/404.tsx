import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
import type { Page } from '@prisma/client'
// import Link from 'next/link'
import get from 'lodash.get'
import { prisma } from '../utils/prisma'
import { FullPage } from '../types'
import SectionBlock from '@components/SectionBlock'
import EditPageButton from '@components/EditPageButton'

const NotFound = (props: FullPage) => {
    const { id, title, metadatas, sections, header, footer } = props

    return (
        <div>
            <Head>
                <title>{title}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
            </Head>

            <EditPageButton redirectTo={`/admin/pages/${id}`} />

            <header>{!!header && <SectionBlock section={header} page={props} />}</header>

            <main>
                {sections?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} />
                ))}
            </main>

            <footer>{!!footer && <SectionBlock section={footer} page={props} />}</footer>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    const allErrorPages = await prisma.page.findMany({
        where: { type: 'error' },
        include: { metadatas: true, sections: true, header: true, footer: true },
    })

    const page: Page = get(allErrorPages, '0', {})

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    return {
        props: {
            ...page,
            updatedAt: Math.floor((page?.updatedAt?.getMilliseconds() || 1) / 1000),
        },
        revalidate: revalidate ? parseInt(revalidate.value) : 60,
    }
}

export default NotFound
