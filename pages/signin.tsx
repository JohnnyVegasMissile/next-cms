import { useAuth } from '../hooks/useAuth'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Input, Card, Space } from 'antd'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import type { GetStaticPathsContext } from 'next'
import Head from 'next/head'
import type { Page } from '@prisma/client'
// import Link from 'next/link'
import get from 'lodash.get'
import { prisma } from '../utils/prisma'
import { FullPage } from '../types'
import SectionBlock from '@components/SectionBlock'
import EditPageButton from '@components/EditPageButton'

const SignIn = (props: FullPage) => {
    const { id, title, metadatas, sections, header, footer } = props
    const { isAuth, signIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuth) {
            router.push('/')
        }
    }, [isAuth])

    return (
        <div>
            <Head>
                <title>{title}</title>
                {metadatas?.map((meta) => (
                    <meta key={meta.id} name={meta.name} content={meta.content} />
                ))}
            </Head>

            <EditPageButton redirectTo={`/admin/pages/${id}`} />

            <header>{!!header && <SectionBlock section={header} page={props} />}</header>

            <main>
                {(!sections || !sections.length) && (
                    <div
                        style={{
                            height: '100vh',
                            width: '100vw',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Card title="Sign In" style={{ width: 400 }}>
                            <form /*onSubmit={signIn}*/>
                                <Space direction="vertical">
                                    <Input prefix={<UserOutlined />} placeholder="Username" />
                                    <Input
                                        prefix={<LockOutlined />}
                                        type="password"
                                        placeholder="Password"
                                    />

                                    <Button
                                        loading={signIn!.isLoading}
                                        style={{ width: '100%' }}
                                        type="primary"
                                        // htmlType="submit"
                                        onClick={() =>
                                            signIn!.mutate({ email: 'root', password: 'root' })
                                        }
                                    >
                                        Sign In
                                    </Button>
                                </Space>
                            </form>
                        </Card>
                    </div>
                )}
                {sections?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} />
                ))}
            </main>

            <footer>{!!footer && <SectionBlock section={footer} page={props} />}</footer>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    const allErrorPages = await prisma.page.findMany({
        where: { type: 'signin' },
        include: { metadatas: true, sections: true, header: true, footer: true },
    })

    const page: Page = get(allErrorPages, '0', {})

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    return {
        props: {
            ...page,
            updatedAt: Math.floor((page?.updatedAt?.getMilliseconds() || 1) / 1000),
        },
        revalidate: revalidate ? parseInt(revalidate.value) : 60,
    }
}

export default SignIn
