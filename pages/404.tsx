import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
import { prisma } from '../utils/prisma'
import EditPageButton from '../components/EditPageButton'
import { PageProps } from 'types'
import get from 'lodash.get'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'

const NotFound = (props: PageProps) => {
    const { id, title, appName } = props

    return (
        <div>
            <Head>
                <title>{`${appName} | ${title}`}</title>
                {/* <title>{title}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))} */}
            </Head>

            <EditPageButton redirectTo={`/admin/contents/${id}`} />

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

export async function getStaticProps(context: GetStaticPathsContext) {
    return await getPagePropsFromUrl('not-found')
}

export default NotFound
