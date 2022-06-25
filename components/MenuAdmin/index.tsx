import { Menu } from 'antd'
import {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
    HomeOutlined,
    LogoutOutlined,
    FileAddOutlined,
    FileImageOutlined,
    OrderedListOutlined,
    PicCenterOutlined,
    PictureOutlined,
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
            <Menu.Item key="home" icon={<HomeOutlined />}>
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
                icon={<FileImageOutlined />}
            >
                <Menu.Item key="/admin/create" icon={<FileAddOutlined />}>
                    <Link href="/admin/pages/create">
                        <a>Create a page</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/admin/pages/" icon={<OrderedListOutlined />}>
                    <Link href="/admin/pages">
                        <a>All pages</a>
                    </Link>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
                key="ElementsMenu"
                title="Elements"
                icon={<PicCenterOutlined />}
            >
                <Menu.Item key="allPages" icon={<PicCenterOutlined />}>
                    <Link href="/admin/elements">
                        <a>All Elements</a>
                    </Link>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="/admin/images" icon={<PictureOutlined />}>
                <Link href="/admin/images">
                    <a>All Images</a>
                </Link>
            </Menu.Item>
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
                    icon={<LogoutOutlined />}
                    onClick={signOut}
                >
                    Disconnect
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    )
}

export default MenuAdmin
