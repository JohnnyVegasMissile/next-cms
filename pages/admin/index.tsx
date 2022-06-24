import { Space, Button } from 'antd'

import { signUp, signIn } from '../../network/auth'

const Admin = () => {
    return (
        <Space
            direction="vertical"
            size="large"
            style={{ width: '100%', padding: 15 }}
        >
            <Button
                onClick={() => {
                    signUp('a@mail.com', '123456')
                }}
            >
                Sign up
            </Button>
            <Button
                onClick={() => {
                    signIn('alex@mail.com', '123456')
                }}
            >
                Sign In
            </Button>
        </Space>
    )
}

Admin.requireAuth = true

export default Admin
