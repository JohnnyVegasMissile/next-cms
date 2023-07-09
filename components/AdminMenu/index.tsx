'use client'

import { Fragment } from 'react'
import { Affix, Badge, Button, Dropdown, Space, message } from 'antd'
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
    LoadingOutlined,
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import styles from './AdminMenu.module.scss'
import { useMutation, useQuery } from '@tanstack/react-query'
import { revalidateAll } from '~/network/api'
import { getUnreadMessages } from '~/network/messages'

const AdminMenu = () => {
    const router = useRouter()
    const pathname = usePathname()

    const revalidate = useMutation(() => revalidateAll(), {
        onSuccess: () => message.success('All pages revalidated with success.'),
        onError: () => message.error('Something went wrong, try again later.'),
    })

    const messagesUnread = useQuery(['messages-unread'], () => getUnreadMessages(), {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: 300000,
    })

    const onClick = (e: any) => {
        switch (e.key) {
            case 'revalidate':
                revalidate.mutate()
                break

            case 'signout':
                break

            default:
                router.push(e.key)
                break
        }
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
                {
                    key: '/admin/contents/create',
                    label: 'Create a content',
                    icon: <PlusSquareOutlined />,
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
            number: messagesUnread.data?.count || 0,
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
                        <Badge size="small" count={messagesUnread.data?.count || 0}>
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
            icon: revalidate.isLoading ? <LoadingOutlined /> : <ReloadOutlined />,
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
        <Affix className={styles['affix']}>
            <div className={styles['wrapper']}>
                <Space size={3}>
                    {menuItems.map((item) => (
                        <Fragment key={item.key}>
                            {item.children ? (
                                <Dropdown
                                    menu={{
                                        items: item.children as any,
                                        onClick,
                                    }}
                                    placement="bottomLeft"
                                >
                                    <Badge size="small" count={item.number} offset={[-4, 3]}>
                                        <Button
                                            size="small"
                                            icon={item.icon}
                                            onClick={() => onClick(item)}
                                            type={pathname?.startsWith(item.key) ? 'primary' : 'default'}
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
