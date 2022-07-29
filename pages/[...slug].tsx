import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
// import Router, { useRouter } from 'next/router'
// import { PrismaClient } from '@prisma/client'
import type { Metadata } from '@prisma/client'
// import { useEffect } from 'react'
import { prisma } from '../utils/prisma'
import SectionBlock from '../components/SectionBlock'
import EditPageButton from '../components/EditPageButton'
import get from 'lodash.get'
// import { FormattedMessage, useIntl } from 'react-intl'
// import Link from 'next/link'

const Pages = (props: any) => {
    // const { id, title, metadatas, sections, type, header, footer } = props
    // const { isAuth, user, setRedirect } = useAuth()

    return (
        <div>
            {/* <Head>
                <title>{props.title}</title>
                {get(props, 'metadatas', []).map((meta: Metadata) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
                {!get(props, 'type', false) && (
                    <>
                        {!!get(props, 'author', false) && <meta name="author" content={get(props, 'author')} />}
                        {!!get(props, 'description', false) && (
                            <meta name="description" content={get(props, 'description')} />
                        )}
                    </>
                )}

            </Head>

            <EditPageButton redirectTo={`/admin/${!!get(props, 'type', false) ? 'pages' : 'articles'}/${props.id}`} />

            <header>
                {!!get(props, 'header', false) && <SectionBlock section={get(props, 'header')} page={props} />}
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
                {!!get(props, 'footer', false) && <SectionBlock section={get(props, 'footer')} page={props} />}
            </footer> */}
        </div>
    )
}

interface NewGetStaticPathsContext extends GetStaticPathsContext {
    params: {
        slug: string[]
    }
}

const sanitizeDate = (date: Date) => Math.floor((date?.getMilliseconds() || 1) / 1000)

// export async function getServerSideProps(context: GetServerSidePropsContext) {
export async function getStaticProps(context: NewGetStaticPathsContext) {
    const { slug } = context.params

    // const page = await prisma.page.findUnique({
    //     where: { slug: slug.join('/') },
    //     include: {
    //         articles: { include: { cover: true } },
    //         metadatas: true,
    //         sections: {
    //             include: {
    //                 form: {
    //                     include: { fields: true },
    //                 },
    //             },
    //         },
    //         header: true,
    //         footer: true,
    //         accesses: true,
    //     },
    // })

    // if (!!page) {
    //     const articles = page.articles.map((article) => ({
    //         ...article,
    //         updatedAt: sanitizeDate(article.updatedAt),
    //         cover: article.cover
    //             ? { ...article.cover, uploadTime: sanitizeDate(article.cover.uploadTime) }
    //             : undefined,
    //     }))

    //     const header = page.header
    //         ? {
    //               ...page.header,
    //               updatedAt: sanitizeDate(page.header.updatedAt),
    //           }
    //         : null

    //     const footer = page.footer
    //         ? {
    //               ...page.footer,
    //               updatedAt: sanitizeDate(page.footer.updatedAt),
    //           }
    //         : null

    //     const sections = page.sections.map((section) => ({
    //         ...section,
    //         form: section.form
    //             ? { ...section.form, updatedAt: sanitizeDate(section.form.updatedAt) }
    //             : null,
    //     }))

    //     props = {
    //         ...page,
    //         header,
    //         sections,
    //         footer,
    //         articles,
    //         updatedAt: sanitizeDate(page.updatedAt),
    //     }
    // } else {
    //     const article = await prisma.article.findUnique({
    //         where: { slug: slug[slug.length - 1] },
    //         include: {
    //             page: true,
    //             cover: true,
    //             sections: { include: { form: { include: { fields: true } } } },
    //         },
    //     })

    //     if (!!article && slug.join('/') === `${article.page.slug}/${article.slug}`) {
    //         const artPage = {
    //             ...article?.page,
    //             updatedAt: sanitizeDate(article?.page.updatedAt),
    //         }

    //         const sections = article.sections.map((section) => ({
    //             ...section,
    //             form: section.form
    //                 ? {
    //                       ...section.form,
    //                       updatedAt: sanitizeDate(section.form.updatedAt),
    //                   }
    //                 : null,
    //         }))

    //         props = {
    //             ...article,
    //             page: artPage,
    //             sections,
    //             updatedAt: sanitizeDate(article?.updatedAt),
    //         }
    //     }
    // }

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    // console.log(props)
    return {
        // props,
        revalidate: revalidate ? parseInt(revalidate.value) : 60,
        // notFound: !props,
    }
}

export async function getStaticPaths(context: GetStaticPathsContext) {
    const containers = await prisma.container.findMany({
        where: {
            published: true,
        },
        include: { contents: true },
    })

    let paths = containers.map((container) => {
        const slug = container.slug!.split('/')
        let contentsSlugs: {
            params: { slug: string[] }
        }[] = []

        if (!!container.contents?.length) {
            contentsSlugs = container.contents
                ?.filter(
                    (content) =>
                        content.published &&
                        content.id !== 'notfound' &&
                        content.id !== 'home' &&
                        content.id !== 'signin'
                )
                ?.map((content) => ({
                    params: { slug: [...slug, content.slug || ''] },
                }))
        }

        return [
            {
                params: { slug },
            },
            ...contentsSlugs,
        ]
    })

    return {
        paths: paths.flat(),
        fallback: true, // false or 'blocking'
    }
}

export default Pages
