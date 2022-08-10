import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
// import Router, { useRouter } from 'next/router'
// import { PrismaClient } from '@prisma/client'
// import type { Content, Metadata } from '@prisma/client'
// import { useEffect } from 'react'
import { prisma } from '../utils/prisma'
// import SectionBlock from '../components/SectionBlock'
import EditPageButton from '../components/EditPageButton'
import get from 'lodash.get'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'
import { FullContentField, PageProps } from '../types'
import Link from 'next/link'
import moment from 'moment'
import CustomImage from '@components/CustomImage'
// import { FormattedMessage, useIntl } from 'react-intl'
// import Link from 'next/link'

const Pages = (props: PageProps) => {
    const { id, type, title, appName, contents, fields } = props
    // const { isAuth, user, setRedirect } = useAuth()

    return (
        <div>
            <Head>
                <link rel="icon" href="api/uploads/favicon.ico" />
                <title>{`${appName} | ${title}`}</title>
                {/* {get(props, 'metadatas', []).map((meta: Metadata) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
                {!get(props, 'type', false) && (
                    <>
                        {!!get(props, 'author', false) && <meta name="author" content={get(props, 'author')} />}
                        {!!get(props, 'description', false) && (
                            <meta name="description" content={get(props, 'description')} />
                        )}
                    </>
                )} */}
            </Head>

            <EditPageButton redirectTo={`/admin/${type === 'container' ? 'containers' : 'contents'}/${id}`} />

            <main>
                {type === 'container' && (
                    <>
                        <h1>{title}</h1>
                        <ul>
                            {contents?.map((content) => (
                                <li key={content.id}>
                                    <Link href={get(content, 'slug.0.fullSlug', '')}>
                                        <a>{content.title}</a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {type === 'content' && (
                    <>
                        <h1>{title}</h1>
                        {fields?.map((field: FullContentField) => {
                            switch (field.type) {
                                case 'string':
                                    return <span>{field.textValue}</span>
                                case 'text':
                                    return <p>{field.textValue}</p>
                                case 'int':
                                    return <p>{field.numberValue}</p>
                                case 'boolean':
                                    return <p>{field.textValue ? 'Yes' : 'No'}</p>
                                case 'image':
                                    return <CustomImage img={field?.media} />
                                case 'date':
                                    return <span>{moment(field.dateValue).format('MMMM Do YYYY')}</span>
                                case 'link':
                                    return (
                                        <Link href={field.textValue || '#'}>
                                            <a>Link</a>
                                        </Link>
                                    )

                                default:
                                    return null
                            }
                        })}
                    </>
                )}
            </main>
            {/* 
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

// export async function getServerSideProps(context: GetServerSidePropsContext) {
export async function getStaticProps(context: NewGetStaticPathsContext) {
    const { slug } = context.params

    return await getPagePropsFromUrl(slug.join('/'))
}

export async function getStaticPaths(context: GetStaticPathsContext) {
    const slugs = await prisma.slug.findMany({
        where: {
            AND: [{ published: true }, { NOT: { fullSlug: '' } }, { NOT: { fullSlug: 'sign-in' } }],
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
