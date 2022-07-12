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
    TeamOutlined,
    IdcardOutlined,
} from '@ant-design/icons'

import { useAuth } from '../../hooks/useAuth'
import { revalidateAll } from '../../network/api'
import Link from 'next/link'
// import { useRouter } from 'next/router'

const { Text } = Typography

function MenuAdmin() {
    const { isAuth, signOut, user } = useAuth()

    if (!isAuth || (user?.role !== 'super-admin' && user?.role !== 'admin')) return null

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
                {
                    key: '2',
                    label: (
                        <Link href="/admin/users/types">
                            <a>User Types</a>
                        </Link>
                    ),
                    icon: <IdcardOutlined />,
                },
            ]}
        />
    )

    return (
        <Affix>
            <div
                style={{
                    borderBottom: '1px solid #f0f0f0',
                    width: '100%',
                    padding: '3px 12px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Space size="small">
                    <Space>
                        <Link href="/">
                            <a>
                                <Text>
                                    <HomeOutlined style={{ marginRight: 4 }} />
                                    Home
                                </Text>
                            </a>
                        </Link>
                    </Space>
                    <Divider type="vertical" />

                    <Dropdown overlay={pageMenu}>
                        <Space>
                            <Link href="/admin/pages">
                                <a>
                                    <Text>
                                        <FileImageOutlined style={{ marginRight: 4 }} />
                                        Pages
                                    </Text>
                                </a>
                            </Link>
                        </Space>
                    </Dropdown>
                    <Divider type="vertical" />

                    <Dropdown overlay={articlesMenu}>
                        <Space>
                            <Link href="/admin/articles">
                                <a>
                                    <Text>
                                        <FileTextOutlined style={{ marginRight: 4 }} />
                                        Articles
                                    </Text>
                                </a>
                            </Link>
                        </Space>
                    </Dropdown>
                    <Divider type="vertical" />

                    <Dropdown overlay={elementsMenu}>
                        <Space>
                            <Link href="/admin/elements">
                                <a>
                                    <Text>
                                        <PicCenterOutlined style={{ marginRight: 4 }} />
                                        Elements
                                    </Text>
                                </a>
                            </Link>
                        </Space>
                    </Dropdown>
                    <Divider type="vertical" />

                    <Dropdown overlay={usersMenu}>
                        <Space>
                            <Link href="/admin/users">
                                <a>
                                    <Text>
                                        <TeamOutlined style={{ marginRight: 4 }} />
                                        Users
                                    </Text>
                                </a>
                            </Link>
                        </Space>
                    </Dropdown>
                    <Divider type="vertical" />

                    <Link href="/admin/images">
                        <a>
                            <Text>
                                <PictureOutlined style={{ marginRight: 4 }} />
                                Images
                            </Text>
                        </a>
                    </Link>
                </Space>

                <Dropdown overlay={homeMenu}>
                    <Space>
                        <Link href="/">
                            <a>
                                <Text className="logged-username">
                                    <UserOutlined style={{ marginRight: 4 }} />
                                    {`${user?.name}`}
                                </Text>
                            </a>
                        </Link>
                    </Space>
                </Dropdown>
            </div>
        </Affix>
    )
}

export default MenuAdmin
