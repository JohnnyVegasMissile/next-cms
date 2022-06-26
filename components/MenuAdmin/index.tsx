import { Fragment } from 'react'
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
    UserOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons'

import { useAuth } from '../../hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/router'

const CustomLink = (link: string, label: string) => (
    <Link href={link}>
        <a>{label}</a>
    </Link>
)

function MenuAdmin() {
    const { isAuth, signOut } = useAuth()
    const router = useRouter()

    if (!isAuth) return null

    const items = [
        {
            key: '/',
            label: CustomLink('/', 'Home'),
            icon: <HomeOutlined />,
            children: [
                {
                    label: CustomLink('/admin', 'Settings'),
                    key: '/admin',
                    icon: <SettingOutlined />,
                },
                {
                    // label: 'Disconnect',
                    label: <span onClick={signOut}>Disconnect</span>,
                    key: 'disconnect',
                    icon: <LogoutOutlined />,
                },
            ],
        },
        {
            label: CustomLink('/admin/pages', 'Pages'),
            key: '/admin/pages',
            icon: <FileImageOutlined />,
            children: [
                {
                    label: CustomLink(
                        '/admin/elements/create',
                        'Create a page'
                    ),
                    key: '/admin/elements/create',
                    icon: <PlusCircleOutlined />,
                },
            ],
        },
        {
            label: CustomLink('/admin/elements', 'Elements'),
            key: '/admin/elements',
            icon: <PicCenterOutlined />,
            children: [
                {
                    label: CustomLink(
                        '/admin/elements/create',
                        'Create an elements'
                    ),
                    key: '/admin/elements/create',
                    icon: <PlusCircleOutlined />,
                },
            ],
        },
        {
            label: CustomLink('/admin/users', 'Users'),
            key: '/admin/users',
            icon: <UserOutlined />,
            children: [
                {
                    label: CustomLink('/admin/users/create', 'Create a users'),
                    key: '/admin/users/create',
                    icon: <PlusCircleOutlined />,
                },
            ],
        },
        {
            label: CustomLink('/admin/images', 'Images'),
            key: '/admin/images',
            icon: <PictureOutlined />,
        },
    ]

    return <Menu mode="horizontal" items={items} />
}

export default MenuAdmin
