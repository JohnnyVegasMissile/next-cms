'use client'

import { Fragment } from 'react'
import { Affix, Badge, Button, Dropdown, Space } from 'antd'
import {
    HomeOutlined,
    FileOutlined,
    PlusSquareOutlined,
    ContainerOutlined,
    PicCenterOutlined,
    FormOutlined,
    IdcardOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    FileImageOutlined,
    LayoutOutlined,
    ReloadOutlined,
    LogoutOutlined,
    SettingOutlined,
    TeamOutlined,
    MailOutlined,
    BookOutlined,
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import styles from './AdminMenu.module.scss'

const AdminMenu = () => {
    const router = useRouter()
    const pathname = usePathname()

    const onClick = (e: any) => {
        switch (e.key) {
            case '/admin':
                router.push('/admin')
                break

            default:
                break
        }

        console.log(e.keyPath)
        router.push(e.key)
    }

    const menuItems = [
        {
            key: '/',
            label: 'Home',
            icon: <HomeOutlined />,
        },
        {
            key: '/admin/pages',
            label: 'Pages',
            icon: <FileOutlined />,
            children: [
                {
                    key: '/admin/pages/create',
                    label: 'Create a page',
                    icon: <PlusSquareOutlined />,
                },
            ],
        },
        {
            key: '/admin/containers',
            label: 'Containers',
            icon: <ContainerOutlined />,
            children: [
                {
                    key: '/admin/containers/create',
                    label: 'Create a container',
                    icon: <PlusSquareOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    key: '/admin/contents',
                    label: 'Contents',
                    icon: <BookOutlined />,
                },
            ],
        },
        {
            key: '/admin/elements',
            label: 'Elements',
            icon: <PicCenterOutlined />,
            children: [
                {
                    key: '/admin/elements/create',
                    label: 'Create an element',
                    icon: <PlusSquareOutlined />,
                },
            ],
        },
        {
            key: '/admin/users',
            label: 'Users',
            icon: <TeamOutlined />,
            children: [
                {
                    key: '/admin/users/create',
                    label: 'Create an user',
                    icon: <PlusSquareOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    key: '/admin/users/roles',
                    label: 'Roles',
                    icon: <IdcardOutlined />,
                },
            ],
        },
        {
            key: '/admin/forms',
            label: 'Forms',
            number: 5,
            icon: <FormOutlined />,
            children: [
                {
                    key: '/admin/forms/create',
                    label: 'Create an form',
                    icon: <PlusSquareOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    key: '/admin/messages',
                    label: 'Messages',
                    icon: (
                        <Badge size="small" count={5}>
                            <MailOutlined />
                        </Badge>
                    ),
                },
            ],
        },
        {
            key: '/admin/menus',
            label: 'Menus',
            icon: <MenuUnfoldOutlined />,
            children: [
                {
                    key: '/admin/menus/create',
                    label: 'Create an menu',
                    icon: <PlusSquareOutlined />,
                },
            ],
        },
        {
            key: '/admin/medias',
            label: 'Medias',
            icon: <FileImageOutlined />,
        },
        {
            key: '/admin/layout',
            label: 'Layout',
            icon: <LayoutOutlined />,
        },
    ]

    const profileItems = [
        {
            key: '/admin',
            label: 'Settings',
            icon: <SettingOutlined />,
        },
        {
            key: 'revalidate',
            label: 'Revalidate all',
            icon: <ReloadOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: 'signout',
            danger: true,
            label: 'disconnect',
            icon: <LogoutOutlined />,
        },
    ]

    return (
        <Affix>
            <div className={styles['wrapper']}>
                <Space size={3}>
                    {menuItems.map((item) => (
                        <Fragment key={item.key}>
                            {item.children ? (
                                <Dropdown
                                    menu={{
                                        items: item.children as any,
                                        onClick: (e) => router.push(e.key),
                                    }}
                                    placement="bottomLeft"
                                >
                                    <Badge size="small" count={item.number} offset={[-4, 3]}>
                                        <Button
                                            size="small"
                                            icon={item.icon}
                                            onClick={() => router.push(item.key)}
                                            type={pathname === item.key ? 'primary' : 'default'}
                                        >
                                            {item.label}
                                        </Button>
                                    </Badge>
                                </Dropdown>
                            ) : (
                                <Button
                                    size="small"
                                    icon={item.icon}
                                    onClick={() => router.push(item.key)}
                                    type={pathname === item.key ? 'primary' : 'default'}
                                >
                                    {item.label}
                                </Button>
                            )}
                        </Fragment>
                    ))}
                </Space>
                <Dropdown menu={{ items: profileItems as any, onClick }} placement="bottomLeft">
                    <Button size="small" icon={<UserOutlined />}>
                        {'username'}
                    </Button>
                </Dropdown>
            </div>
        </Affix>
    )
}

export default AdminMenu
