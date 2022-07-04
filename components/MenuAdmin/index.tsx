import { Affix, Button, Divider, Dropdown, Menu, Space, Typography } from 'antd'
import {
    SettingOutlined,
    HomeOutlined,
    LogoutOutlined,
    FileImageOutlined,
    PicCenterOutlined,
    PictureOutlined,
    UserOutlined,
    PlusCircleOutlined,
    FileTextOutlined,
    UndoOutlined,
    SmileOutlined,
    DownOutlined,
    SearchOutlined,
} from '@ant-design/icons'

import { useAuth } from '../../hooks/useAuth'
import { revalidateAll } from '../../network/api'
import Link from 'next/link'
// import { useRouter } from 'next/router'

const { Text } = Typography

const CustomLink = (link: string, label: string) => (
    <Link href={link}>
        <a>{label}</a>
    </Link>
)

function MenuAdmin() {
    const { isAuth, signOut } = useAuth()
    // const router = useRouter()

    if (!isAuth) return null

    // const items = [
    //     {
    //         key: '/',
    //         label: CustomLink('/', 'Home'),
    //         icon: <HomeOutlined />,
    //         children: [
    //             {
    //                 label: CustomLink('/admin', 'Settings'),
    //                 key: '/admin',
    //                 icon: <SettingOutlined />,
    //             },
    //             {
    //                 label: (
    //                     <Text onClick={() => revalidateAll()}>Revalidate all pages</Text>
    //                 ),
    //                 key: 'revalidate',
    //                 icon: <UndoOutlined />,
    //             },
    //             {
    //                 // label: 'Disconnect',
    //                 label: <span onClick={signOut}>Disconnect</span>,
    //                 key: 'disconnect',
    //                 icon: <LogoutOutlined />,
    //             },
    //         ],
    //     },
    //     {
    //         label: CustomLink('/admin/pages', 'Pages'),
    //         key: '/admin/pages',
    //         icon: <FileImageOutlined />,
    //         children: [
    //             {
    //                 label: CustomLink('/admin/pages/create', 'Create a page'),
    //                 key: '/admin/pages/create',
    //                 icon: <PlusCircleOutlined />,
    //             },
    //         ],
    //     },
    //     {
    //         label: CustomLink('/admin/articles', 'Articles'),
    //         key: '/admin/articles',
    //         icon: <FileTextOutlined />,
    //         children: [
    //             {
    //                 label: CustomLink('/admin/articles/create', 'Create an article'),
    //                 key: '/admin/articles/create',
    //                 icon: <PlusCircleOutlined />,
    //             },
    //         ],
    //     },
    //     {
    //         label: CustomLink('/admin/elements', 'Elements'),
    //         key: '/admin/elements',
    //         icon: <PicCenterOutlined />,
    //         children: [
    //             {
    //                 label: CustomLink('/admin/elements/create', 'Create an elements'),
    //                 key: '/admin/elements/create',
    //                 icon: <PlusCircleOutlined />,
    //             },
    //         ],
    //     },
    //     {
    //         label: CustomLink('/admin/users', 'Users'),
    //         key: '/admin/users',
    //         icon: <UserOutlined />,
    //         children: [
    //             {
    //                 label: CustomLink('/admin/users/create', 'Create a users'),
    //                 key: '/admin/users/create',
    //                 icon: <PlusCircleOutlined />,
    //             },
    //         ],
    //     },
    //     {
    //         label: CustomLink('/admin/images', 'Images'),
    //         key: '/admin/images',
    //         icon: <PictureOutlined />,
    //     },
    // ]

    const homeMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href="/admin">
                            <a>Settings</a>
                        </Link>
                    ),
                    icon: <SettingOutlined />,
                },
                {
                    key: '2',
                    label: 'Revalidate all pages',
                    icon: <UndoOutlined />,
                    onClick: revalidateAll,
                },
                {
                    type: 'divider',
                },
                {
                    key: '3',
                    label: 'Disconnect',
                    icon: <LogoutOutlined />,
                    onClick: signOut,
                    danger: true,
                },
            ]}
        />
    )

    const pageMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href="/admin/pages/create">
                            <a>Create a page</a>
                        </Link>
                    ),
                    icon: <PlusCircleOutlined />,
                },
            ]}
        />
    )

    const articlesMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href="/admin/articles/create">
                            <a>Create an article</a>
                        </Link>
                    ),
                    icon: <PlusCircleOutlined />,
                },
            ]}
        />
    )

    const elementsMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href="/admin/elements/create">
                            <a>Create an elements</a>
                        </Link>
                    ),
                    icon: <PlusCircleOutlined />,
                },
            ]}
        />
    )

    const usersMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href="/admin/users/create">
                            <a>Create an users</a>
                        </Link>
                    ),
                    icon: <PlusCircleOutlined />,
                },
            ]}
        />
    )

    return (
        // <Affix>
        <Space
            size="small"
            style={{
                borderBottom: '1px solid #f0f0f0',
                width: '100%',
                padding: '3px 7px',
            }}
        >
            <Dropdown overlay={homeMenu}>
                <Space>
                    <Link href="/">
                        <a>
                            <SearchOutlined style={{ marginRight: 4 }} />
                            Home
                        </a>
                    </Link>
                </Space>
            </Dropdown>
            <Divider type="vertical" />

            <Dropdown overlay={pageMenu}>
                <Space>
                    <Link href="/admin/pages">
                        <a>
                            <FileImageOutlined style={{ marginRight: 4 }} />
                            Pages
                        </a>
                    </Link>
                </Space>
            </Dropdown>
            <Divider type="vertical" />

            <Dropdown overlay={articlesMenu}>
                <Space>
                    <Link href="/admin/articles">
                        <a>
                            <FileTextOutlined style={{ marginRight: 4 }} />
                            Articles
                        </a>
                    </Link>
                </Space>
            </Dropdown>
            <Divider type="vertical" />

            <Dropdown overlay={elementsMenu}>
                <Space>
                    <Link href="/admin/elements">
                        <a>
                            <PicCenterOutlined style={{ marginRight: 4 }} />
                            Elements
                        </a>
                    </Link>
                </Space>
            </Dropdown>
            <Divider type="vertical" />

            <Dropdown overlay={usersMenu}>
                <Space>
                    <Link href="/admin/users">
                        <a>
                            <UserOutlined style={{ marginRight: 4 }} />
                            Users
                        </a>
                    </Link>
                </Space>
            </Dropdown>
            <Divider type="vertical" />

            <Link href="/admin/images">
                <a>
                    <PictureOutlined style={{ marginRight: 4 }} />
                    Images
                </a>
            </Link>
        </Space>
        // </Affix>
    )
    // return <Menu mode="horizontal" items={items} />
}

export default MenuAdmin
