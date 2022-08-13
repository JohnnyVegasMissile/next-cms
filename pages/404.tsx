import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
// import { prisma } from '../utils/prisma'
import EditPageButton from '../components/EditPageButton'
import { PageProps } from 'types'
// import get from 'lodash.get'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'
import Link from 'next/link'
import { Button, Result } from 'antd'
import SectionBlock from '../components/SectionBlock'

const NotFound = (props: PageProps) => {
    const { id, title, appName, sections, theme, metadatas, layout } = props

    return (
        <div>
            <Head>
                <link rel="icon" href="api/uploads/favicon.ico" />
                <title>{`${appName} | ${title}`}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
            </Head>

            <EditPageButton redirectTo={`/admin/contents/${id}`} />

            <header>
                {layout?.header?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} theme={theme} />
                ))}
            </header>

            <main>
                {(!sections || !sections.length) && <Default404 />}

                {layout?.topBody?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} theme={theme} />
                ))}
                {sections?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} theme={theme} />
                ))}
                {layout?.bottomBody?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} theme={theme} />
                ))}
            </main>

            <footer>
                {layout?.footer?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} theme={theme} />
                ))}
            </footer>
        </div>
    )
}

const Default404 = () => {
    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link href="/">
                        <a>
                            <Button type="primary">Back Home</Button>
                        </a>
                    </Link>
                }
            />
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    return await getPagePropsFromUrl('not-found')
}

export default NotFound
