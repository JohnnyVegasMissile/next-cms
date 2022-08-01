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

const sanitizeDate = (date: Date) => (!!date ? Math.floor((date?.getMilliseconds() || 1) / 1000) : undefined)

// export async function getServerSideProps(context: GetServerSidePropsContext) {
export async function getStaticProps(context: NewGetStaticPathsContext) {
    const { slug } = context.params

    const notFound = { notFound: true }

    const releatedSlug = await prisma.slug.findUnique({
        where: { fullSlug: slug.join('/') },
        include: {
            container: {
                include: {
                    metadatas: true,
                    accesses: true,
                    sections: { include: { form: true } },
                    contents: {
                        include: {
                            fields: {
                                include: { media: true },
                            },
                        },
                    },
                },
            },
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
        type: !!releatedSlug?.container ? 'container' : 'content',
        ...get(releatedSlug, 'container', {}),
        ...get(releatedSlug, 'content', {}),
        updatedAt: sanitizeDate(
            get(releatedSlug, 'container.updatedAt', get(releatedSlug, 'content.updatedAt', undefined))
        ),
    }

    if (!releatedSlug || !props.published) {
        return notFound
    }

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    return {
        props,
        revalidate: revalidate ? parseInt(revalidate.value) : 60,
    }
}

export async function getStaticPaths(context: GetStaticPathsContext) {
    const slugs = await prisma.slug.findMany({
        where: {
            published: true,
        },
    })

    const paths = slugs.map((slug) => ({
        params: { slug: slug.fullSlug.split('/') },
    }))

    return {
        paths,
        fallback: true, // false or 'blocking'
    }
}

export default Pages
