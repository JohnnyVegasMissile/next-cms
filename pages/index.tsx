import Head from 'next/head'
import Link from 'next/link'
import { Button, Result } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import type { GetStaticPathsContext } from 'next'
import EditPageButton from '../components/EditPageButton'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'

import { PageProps } from '../types'
import SectionBlock from '../components/SectionBlock'

const Home = (props: PageProps) => {
    const { id, appName, sections, theme, metadatas, layout } = props

    return (
        <div>
            <Head>
                <link rel="icon" href="api/uploads/favicon.ico" />
                <title>{appName}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
            </Head>

            <EditPageButton redirectTo={`/admin/containers/${id}`} />

            <header>
                {layout?.header?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} theme={theme} />
                ))}
            </header>

            <main>
                {(!sections || !sections.length) && <DefaultHome />}

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

const DefaultHome = () => {
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
                icon={<HomeOutlined />}
                title="Welcome to next cms! Login to start edit your website."
                extra={
                    <Link href="/sign-in">
                        <a>
                            <Button type="primary">Sign In</Button>
                        </a>
                    </Link>
                }
            />
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    return await getPagePropsFromUrl('')
}

export default Home
