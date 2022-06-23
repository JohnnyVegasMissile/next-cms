import { Menu } from 'antd'
import {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from '@ant-design/icons'

import { useAuth } from '../../hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/router'

function MenuAdmin() {
    const { isAuth, signOut } = useAuth()
    const router = useRouter()

    if (!isAuth) return null

    return (
        <Menu mode="horizontal" defaultSelectedKeys={[router.pathname]}>
            <Menu.Item key="home" icon={<MailOutlined />}>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </Menu.Item>
            <Menu.Item key="/admin" icon={<MailOutlined />}>
                <Link href="/admin">
                    <a>Admin</a>
                </Link>
            </Menu.Item>
            <Menu.SubMenu
                key="/admin/pages"
                title="Pages"
                icon={<SettingOutlined />}
            >
                <Menu.Item key="/admin/pages" icon={<AppstoreOutlined />}>
                    <Link href="/admin/pages">
                        <a>All Pages</a>
                    </Link>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
                key="ElementsMenu"
                title="Elements"
                icon={<SettingOutlined />}
            >
                <Menu.Item key="allPages" icon={<AppstoreOutlined />}>
                    <Link href="/admin/elements">
                        <a>All Elements</a>
                    </Link>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
                key="/admin/images"
                title="Images"
                icon={<SettingOutlined />}
            >
                <Menu.Item key="/admin/images" icon={<AppstoreOutlined />}>
                    <Link href="/admin/images">
                        <a>All Images</a>
                    </Link>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
                key="SettingsMenu"
                title="Settings"
                icon={<SettingOutlined />}
            >
                <Menu.Item key="/install" icon={<AppstoreOutlined />}>
                    <Link href="/install">
                        <a>Install</a>
                    </Link>
                </Menu.Item>
                <Menu.Item
                    key="install"
                    icon={<AppstoreOutlined />}
                    onClick={signOut}
                >
                    Disconnect
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    )
}

export default MenuAdmin
