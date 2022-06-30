import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
// import Router, { useRouter } from 'next/router'
// import { PrismaClient } from '@prisma/client'
import type { Article } from '@prisma/client'
import { FullPage } from '../types'
// import { useEffect } from 'react'
import { prisma } from '../utils/prisma'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { Button } from 'antd'
import SectionBlock from '../components/SectionBlock'

const Pages = (props: FullPage) => {
    const { id, title, metadatas, articles, sections, type } = props
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
                    <Link href={`/admin/${!!type ? 'pages' : 'articles'}/${id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>
            )}

            <header></header>

            <main>
                {sections?.map((section) => (
                    <SectionBlock
                        key={section.id}
                        section={section}
                        page={props as FullPage}
                    />
                ))}
            </main>

            <footer></footer>
        </div>
    )
}

interface NewGetStaticPathsContext extends GetStaticPathsContext {
    params: {
        slug: string[]
    }
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
export async function getStaticProps(context: NewGetStaticPathsContext) {
    const { slug } = context.params
    let props
    const page = await prisma.page.findUnique({
        where: { slug: slug.join('/') },
        include: { articles: true, metadatas: true, sections: true },
    })

    if (!!page) {
        const articles = page.articles.map((article) => ({
            ...article,
            updatedAt: Math.floor((article.updatedAt?.getMilliseconds() || 1) / 1000),
        }))

        props = {
            ...page,
            articles,
            updatedAt: Math.floor((page.updatedAt?.getMilliseconds() || 1) / 1000),
        }
    } else {
        const article: Article | null = await prisma.article.findUnique({
            where: { slug: slug[slug.length - 1] },
        })

        props = {
            ...article,
            updatedAt: Math.floor((article?.updatedAt?.getMilliseconds() || 1) / 1000),
        }
    }

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    return {
        props,
        revalidate: revalidate ? parseInt(revalidate.value) : 60,
        notFound: !props,
    }
}

export async function getStaticPaths(context: GetStaticPathsContext) {
    const pages = await prisma.page.findMany({
        where: {
            published: true,
            OR: [{ type: 'page' }, { type: 'article' }],
        },
        include: { articles: true },
    })

    let paths = pages.map((page) => {
        const slug = page.slug!.split('/')

        let articlesSlugs: {
            params: { slug: string[] }
        }[] = []

        if (page.articles) {
            articlesSlugs = page.articles
                ?.filter((article) => article.published)
                ?.map((article) => ({
                    params: { slug: [...slug, article.slug] },
                }))
        }

        return [
            {
                params: { slug },
            },
            ...articlesSlugs,
        ]
    })

    return {
        paths: paths.flat(),
        fallback: true, // false or 'blocking'
    }
}

export default Pages
