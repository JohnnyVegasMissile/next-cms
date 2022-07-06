import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
import type { Page } from '@prisma/client'
// import Link from 'next/link'
import get from 'lodash.get'
import { FullPage } from 'types'

import { prisma } from '../utils/prisma'
import { useAuth } from '../hooks/useAuth'
import { Affix, Button } from 'antd'
import Link from 'next/link'
import SectionBlock from '../components/SectionBlock'

const Home = (props: FullPage) => {
    const { id, title, metadatas, sections, header, footer } = props
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
                <Affix>
                    <Button
                        size="small"
                        type="primary"
                        style={{ position: 'absolute', right: 5, top: 2 }}
                    >
                        <Link href={`/admin/pages/${id}`}>
                            <a>Edit</a>
                        </Link>
                    </Button>
                </Affix>
            )}

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
    const allHomepages = await prisma.page.findMany({
        where: { type: 'home' },
        include: { metadatas: true, sections: true, header: true, footer: true },
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
