import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
import type { Page } from '@prisma/client'
// import Link from 'next/link'
import get from 'lodash.get'
import { FullPage } from 'types'

import { prisma } from '../utils/prisma'

const Home = (props: FullPage) => {
    const { title, metadatas } = props

    return (
        <div>
            <Head>
                <title>{title}</title>
                {metadatas?.map((meta) => (
                    <meta
                        key={meta.id}
                        name={meta.name}
                        content={meta.content}
                    />
                ))}
            </Head>

            <header></header>

            <main>{title}</main>

            <footer></footer>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    const allHomepages = await prisma.page.findMany({
        where: { type: 'home' },
    })

    const page: Page = get(allHomepages, '0', {})

    return {
        props: {
            ...page,
            updatedAt: Math.floor(
                (page?.updatedAt?.getMilliseconds() || 1) / 1000
            ),
        },
        revalidate: 60,
    }
}

export default Home
