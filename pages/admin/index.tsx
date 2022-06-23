import { Space } from 'antd'

const Admin = () => {
    return (
        <Space
            direction="vertical"
            size="large"
            style={{ width: '100%', padding: 15 }}
        ></Space>
    )
}

Admin.requireAuth = true

export default Admin
