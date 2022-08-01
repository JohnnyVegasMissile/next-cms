import getPagePropsFromUrl from '@utils/getPagePropsFromUrl'
import get from 'lodash.get'
import type { GetStaticPathsContext } from 'next'

import { PageProps } from '../types'
import { prisma } from '../utils/prisma'

const Home = (props: PageProps) => {
    // const { id, title, metadatas, sections, header, footer } = props

    return (
        <div>
            {/* <Head>
                <title>{title}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
            </Head>

            <EditPageButton redirectTo={`/admin/pages/${id}`} />

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
