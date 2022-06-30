import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
import type { Page } from '@prisma/client'
// import Link from 'next/link'
import get from 'lodash.get'
import { FullPage } from 'types'

import { prisma } from '../utils/prisma'
import { useAuth } from '../hooks/useAuth'
import { Button } from 'antd'
import Link from 'next/link'
import SectionBlock from '../components/SectionBlock'

const Home = (props: FullPage) => {
    const { id, title, metadatas, articles, sections } = props
    const { isAuth } = useAuth()

    return (
        <div>
            <Head>
                <title>{title}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
            </Head>

            {isAuth && (
                <Button
                    size="small"
                    type="primary"
                    style={{ position: 'absolute', right: 5, top: 50 }}
                >
                    <Link href={`/admin/pages/${id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>
            )}

            <header></header>

            <main>
                {sections?.map((section) => (
                    <SectionBlock key={section.id} section={section} articles={articles} />
                ))}
            </main>

            <footer></footer>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    const allHomepages = await prisma.page.findMany({
        where: { type: 'home' },
        include: { metadatas: true, sections: true },
    })

    const page: Page = get(allHomepages, '0', {})

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

export default Home
