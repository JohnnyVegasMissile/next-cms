import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
// import Router, { useRouter } from 'next/router'
// import { PrismaClient } from '@prisma/client'
import type { Article, Metadata } from '@prisma/client'
import { FullArticle, FullPage } from '../types'
// import { useEffect } from 'react'
import { prisma } from '../utils/prisma'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { Affix, Button } from 'antd'
import SectionBlock from '../components/SectionBlock'
import get from 'lodash.get'

const Pages = (props: FullPage | FullArticle) => {
    // const { id, title, metadatas, sections, type, header, footer } = props
    const { isAuth } = useAuth()

    return (
        <div>
            <Head>
                <title>{props.title}</title>
                {get(props, 'metadatas', []).map((meta: Metadata) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
                {!get(props, 'type', false) && (
                    <>
                        {!!get(props, 'author', false) && (
                            <meta name="author" content={get(props, 'author')} />
                        )}
                        {!!get(props, 'description', false) && (
                            <meta name="description" content={get(props, 'description')} />
                        )}
                    </>
                )}
            </Head>

            {isAuth && (
                <Affix offsetTop={33}>
                    <Button
                        size="small"
                        type="primary"
                        style={{ position: 'absolute', right: 5 }}
                    >
                        <Link
                            href={`/admin/${
                                !!get(props, 'type', false) ? 'pages' : 'articles'
                            }/${props.id}`}
                        >
                            <a>Edit</a>
                        </Link>
                    </Button>
                </Affix>
            )}

            <header>
                {!!get(props, 'header', false) && (
                    <SectionBlock section={get(props, 'header')} page={props} />
                )}
            </header>

            {!!get(props, 'type', false) ? (
                <main>
                    {get(props, 'sections', [])?.map((section) => (
                        <SectionBlock key={section.id} section={section} page={props} />
                    ))}
                </main>
            ) : (
                <article>
                    {get(props, 'sections', [])?.map((section) => (
                        <SectionBlock key={section.id} section={section} page={props} />
                    ))}
                </article>
            )}

            <footer>
                {!!get(props, 'footer', false) && (
                    <SectionBlock section={get(props, 'footer')} page={props} />
                )}
            </footer>
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
        include: {
            articles: true,
            metadatas: true,
            sections: true,
            header: true,
            footer: true,
        },
    })

    if (!!page) {
        const articles = page.articles.map((article) => ({
            ...article,
            updatedAt: Math.floor((article.updatedAt?.getMilliseconds() || 1) / 1000),
        }))

        const header = page.header
            ? {
                  ...page.header,
                  updatedAt: Math.floor(
                      (page.header.updatedAt?.getMilliseconds() || 1) / 1000
                  ),
              }
            : null

        const footer = page.footer
            ? {
                  ...page.footer,
                  updatedAt: Math.floor(
                      (page.footer.updatedAt?.getMilliseconds() || 1) / 1000
                  ),
              }
            : null

        props = {
            ...page,
            header,
            footer,
            articles,
            updatedAt: Math.floor((page.updatedAt?.getMilliseconds() || 1) / 1000),
        }
    } else {
        const article: Article | null = await prisma.article.findUnique({
            where: { slug: slug[slug.length - 1] },
            include: { page: true },
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
            OR: [{ type: 'page' }, { type: 'list' }],
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
