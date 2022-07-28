import { useAuth } from '../hooks/useAuth'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Input, Card, Space } from 'antd'

import type { GetStaticPathsContext } from 'next'
import { prisma } from '../utils/prisma'
import { FullPage } from '../types'
import { useFormik } from 'formik'

const SignIn = (props: FullPage) => {
    // const { isAuth } = useAuth()
    // const router = useRouter()

    // useEffect(() => {
    //     if (isAuth) {
    //         console.log('Redirection from Sign In', router.route)
    //         router.push('/')
    //     }
    // }, [router.route])

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
                {(!sections || !sections.length) && <DefaultSignInForm />}

                {sections?.map((section) => (
                    <SectionBlock key={section.id} section={section} page={props} />
                ))}
            </main>

            <footer>{!!footer && <SectionBlock section={footer} page={props} />}</footer> */}
        </div>
    )
}

const DefaultSignInForm = () => {
    const { signIn } = useAuth()
    // const router = useRouter()

    const { values, /*errors,*/ handleSubmit, handleChange } = useFormik<{
        email: string
        password: string
    }>({
        initialValues: { email: '', password: '' },
        // validate: (values) => ({}),
        // onSubmit: async (values) => {
        //     console.log(values)
        // },
        onSubmit: async (values) => signIn!.mutate(values),
    })

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

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
            <Card title="Authentification" style={{ width: 400 }}>
                <form onSubmit={handleSubmit}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Input
                            id="email"
                            prefix={<UserOutlined />}
                            value={values.email}
                            onChange={(e) => onHandleChange('email', e.target.value)}
                            placeholder="Email"
                        />
                        <Input
                            id="password"
                            prefix={<LockOutlined />}
                            value={values.password}
                            onChange={(e) => onHandleChange('password', e.target.value)}
                            type="password"
                            placeholder="Password"
                        />

                        <Button loading={signIn!.isLoading} style={{ width: '100%' }} type="primary" htmlType="submit">
                            Sign In
                        </Button>
                    </Space>
                </form>
            </Card>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    // const allErrorPages = await prisma.page.findMany({
    //     where: { type: 'signin' },
    //     include: { metadatas: true, sections: true, header: true, footer: true },
    // })

    // const page: Page = get(allErrorPages, '0', {})

    const revalidate = await prisma.setting.findUnique({
        where: { name: 'revalidate' },
    })

    return {
        props: {
            // ...page,
            // updatedAt: Math.floor((page?.updatedAt?.getMilliseconds() || 1) / 1000),
        },
        revalidate: revalidate ? parseInt(revalidate.value) : 60,
    }
}

export default SignIn
