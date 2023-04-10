'use client'

import { Button, Card, Input, Space } from 'antd'
import { useFormik } from 'formik'
import WithLabel from '../WithLabel'

const SignIn = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2))
        },
    })

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25vh' }}>
            <Card title="Sign in" size="small">
                <form onSubmit={formik.handleSubmit}>
                    <Space direction="vertical" style={{ width: '100%', minWidth: 350 }}>
                        <WithLabel label="Email">
                            <Input size="small" />
                        </WithLabel>
                        <WithLabel label="Password">
                            <Input.Password size="small" />
                        </WithLabel>
                        <Button size="small" type="primary" htmlType="submit">
                            Sign in
                        </Button>
                    </Space>
                </form>
            </Card>
        </div>
    )
}

export default SignIn
