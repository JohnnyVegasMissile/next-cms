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
            icon: <HomeOutlined rev={undefined} />,
        },
        {
            key: '/admin/pages',
            label: 'Pages',
            icon: <FileOutlined rev={undefined} />,
            children: [
                {
                    key: '/admin/pages/create',
                    label: 'Create a page',
                    icon: <PlusSquareOutlined rev={undefined} />,
                },
            ],
        },
        {
            key: '/admin/containers',
            label: 'Containers',
            icon: <ContainerOutlined rev={undefined} />,
            children: [
                {
                    key: '/admin/containers/create',
                    label: 'Create a container',
                    icon: <PlusSquareOutlined rev={undefined} />,
                },
                {
                    type: 'divider',
                },
                {
                    key: '/admin/contents',
                    label: 'Contents',
                    icon: <BookOutlined rev={undefined} />,
                },
                {
                    key: '/admin/contents/create',
                    label: 'Create a content',
                    icon: <PlusSquareOutlined rev={undefined} />,
                },
            ],
        },
        {
            key: '/admin/elements',
            label: 'Elements',
            icon: <PicCenterOutlined rev={undefined} />,
            children: [
                {
                    key: '/admin/elements/create',
                    label: 'Create an element',
                    icon: <PlusSquareOutlined rev={undefined} />,
                },
            ],
        },
        {
            key: '/admin/users',
            label: 'Users',
            icon: <TeamOutlined rev={undefined} />,
            children: [
                {
                    key: '/admin/users/create',
                    label: 'Create an user',
                    icon: <PlusSquareOutlined rev={undefined} />,
                },
                {
                    type: 'divider',
                },
                {
                    key: '/admin/users/roles',
                    label: 'Roles',
                    icon: <IdcardOutlined rev={undefined} />,
                },
            ],
        },
        {
            key: '/admin/forms',
            label: 'Forms',
            number: 5,
            icon: <FormOutlined rev={undefined} />,
            children: [
                {
                    key: '/admin/forms/create',
                    label: 'Create an form',
                    icon: <PlusSquareOutlined rev={undefined} />,
                },
                {
                    type: 'divider',
                },
                {
                    key: '/admin/messages',
                    label: 'Messages',
                    icon: (
                        <Badge size="small" count={5}>
                            <MailOutlined rev={undefined} />
                        </Badge>
                    ),
                },
            ],
        },
        {
            key: '/admin/menus',
            label: 'Menus',
            icon: <MenuUnfoldOutlined rev={undefined} />,
            children: [
                {
                    key: '/admin/menus/create',
                    label: 'Create an menu',
                    icon: <PlusSquareOutlined rev={undefined} />,
                },
            ],
        },
        {
            key: '/admin/medias',
            label: 'Medias',
            icon: <FileImageOutlined rev={undefined} />,
        },
        {
            key: '/admin/layout',
            label: 'Layout',
            icon: <LayoutOutlined rev={undefined} />,
        },
    ]

    const profileItems = [
        {
            key: '/admin',
            label: 'Settings',
            icon: <SettingOutlined rev={undefined} />,
        },
        {
            key: 'revalidate',
            label: 'Revalidate all',
            icon: <ReloadOutlined rev={undefined} />,
        },
        {
            type: 'divider',
        },
        {
            key: 'signout',
            danger: true,
            label: 'disconnect',
            icon: <LogoutOutlined rev={undefined} />,
        },
    ]

    return (
        <Affix className={styles['affix']}>
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
                    <Button size="small" icon={<UserOutlined rev={undefined} />}>
                        {'username'}
                    </Button>
                </Dropdown>
            </div>
        </Affix>
    )
}

export default AdminMenu
