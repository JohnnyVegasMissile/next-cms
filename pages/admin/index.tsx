import { Button, Space } from 'antd'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import { getFiles } from '../../network/admin'

const Admin = () => {
    const { signOut } = useAuth()

    return (
        <Space
            direction="vertical"
            size="large"
            style={{ width: '100%', padding: 15 }}
        >
            <Button type="primary">
                <Link href="/admin/elements">
                    <a>Elements</a>
                </Link>
            </Button>
            <Button type="primary">
                <Link href="/admin/pages">
                    <a>Pages</a>
                </Link>
            </Button>

            <Button type="primary">
                <Link href="/admin/images">
                    <a>Images</a>
                </Link>
            </Button>
            <Button danger onClick={signOut}>
                Sign Out
            </Button>

            <Button onClick={getFiles}>getFiles</Button>
        </Space>
    )
}

Admin.requireAuth = true

export default Admin
