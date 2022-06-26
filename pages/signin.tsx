import { useAuth } from '../hooks/useAuth'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Input, Card } from 'antd'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const SignIn = () => {
    const { isAuth, signIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuth) {
            router.push('/')
        }
    }, [isAuth])

    return (
        <Card title="Sign In" style={{ width: 400 }}>
            <form /*onSubmit={signIn}*/>
                <Input prefix={<UserOutlined />} placeholder="Username" />
                <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                />

                <Button
                    style={{ width: '100%' }}
                    type="primary"
                    // htmlType="submit"
                    onClick={signIn}
                >
                    Sign In
                </Button>
            </form>
        </Card>
    )

    // return <Button onClick={signIn}>Sign in</Button>
}

export default SignIn
