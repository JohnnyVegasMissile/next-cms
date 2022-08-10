import EditPageButton from '../components/EditPageButton'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'
// import get from 'lodash.get'
import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'

import { PageProps } from '../types'
// import { prisma } from '../utils/prisma'

const Home = (props: PageProps) => {
    const { id, appName } = props

    return (
        <div>
            <Head>
                <link rel="icon" href="api/uploads/favicon.ico" />
                <title>{appName}</title>
                {/* {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))} */}
            </Head>

            <EditPageButton redirectTo={`/admin/containers/${id}`} />
            {/* 
            <header>{!!header && <SectionBlock section={header} page={props} />}</header>

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
    return await getPagePropsFromUrl('')
}

export default Home
