import { useFormik } from 'formik'
import type { GetStaticPathsContext } from 'next'
import { Button, Input, Card, Space } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

import { PageProps } from '../types'
import { useAuth } from '../hooks/useAuth'
import PageDisplay from '../components/PageDisplay'
import getPagePropsFromUrl from '../utils/getPagePropsFromUrl'

const SignIn = (props: PageProps) => <PageDisplay pageProps={props} onEmpty={<DefaultSignInForm />} />

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

                        <Button
                            loading={signIn!.isLoading}
                            style={{ width: '100%' }}
                            type="primary"
                            htmlType="submit"
                        >
                            Sign In
                        </Button>
                    </Space>
                </form>
            </Card>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    return await getPagePropsFromUrl('sign-in')
}

export default SignIn
