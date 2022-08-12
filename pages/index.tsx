import EditPageButton from '../components/EditPageButton'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'
// import get from 'lodash.get'
import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'

import { PageProps } from '../types'
import { HomeOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import Link from 'next/link'
// import { prisma } from '../utils/prisma'

const Home = (props: PageProps) => {
    const { id, appName, sections, theme } = props

    return (
        <div style={{ backgroundColor: theme?.background || undefined }}>
            <Head>
                <link rel="icon" href="api/uploads/favicon.ico" />
                <title>{appName}</title>
                {/* {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))} */}
            </Head>

            <EditPageButton redirectTo={`/admin/containers/${id}`} />
            {/* 
            <header>{!!header && <SectionBlock section={header} page={props} />}</header> */}

            <main>
                {(!sections || !sections.length) && <DefaultHome />}

                {/* {sections?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} />
                ))} */}
            </main>
            {/* 
            <footer>{!!footer && <SectionBlock section={footer} page={props} />}</footer> */}
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
