import { Space, Avatar } from 'antd'

const Admin = () => {
    return (
        <Space
            direction="vertical"
            size="large"
            style={{ width: '100%', padding: 15 }}
        >
            <Avatar src="/favicon.ico" shape="square" size="large" />
        </Space>
    )
}

Admin.requireAuth = true

export default Admin
