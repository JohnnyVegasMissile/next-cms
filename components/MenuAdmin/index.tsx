import { Affix, Divider, Dropdown, Menu, message, Space, Typography } from 'antd'
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
    TeamOutlined,
    IdcardOutlined,
    LoadingOutlined,
    ReloadOutlined,
    MailOutlined,
    FormOutlined,
    ContainerOutlined,
    FileOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons'

import { useAuth } from '../../hooks/useAuth'
import { revalidateAll } from '../../network/api'
import Link from 'next/link'
import { useMutation, useQuery, UseQueryResult } from 'react-query'
import { Container } from '@prisma/client'
import { getContainers } from '@network/containers'
import get from 'lodash.get'
// import { useRouter } from 'next/router'

const { Text } = Typography

function MenuAdmin() {
    const { isAuth, signOut, user } = useAuth()

    const containers: UseQueryResult<Container[], Error> = useQuery<Container[], Error>(['containers', {}], () =>
        getContainers()
    )

    const mutation = useMutation(() => revalidateAll(), {
        onSuccess: () => {
            message.success('Pages successfully revalidated')
        },
        onError: (err) => {
            message.error('Error Revalidating pages')
        },
    })

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
                    label: 'Revalidate all',
                    icon: mutation.isLoading ? <LoadingOutlined /> : <ReloadOutlined />,
                    onClick: () => mutation.mutate(),
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

    const containersMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href="/admin/containers/create">
                            <a>Create a container</a>
                        </Link>
                    ),
                    icon: <PlusCircleOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    key: '2',
                    label: (
                        <Link href="/admin/contents">
                            <a>All contents</a>
                        </Link>
                    ),
                    icon: <UnorderedListOutlined />,
                },
                {
                    key: '3',
                    type: 'group',
                    label: 'Contents',
                    children: get(containers, 'data', []).map((container: Container, idx: number) => ({
                        key: `3-${idx}`,
                        label: container.title,
                        icon: <FileTextOutlined />,
                        children: [
                            {
                                key: `3-${idx}-1`,
                                label: (
                                    <Link
                                        href={{
                                            pathname: '/admin/contents',
                                            query: { container: container.id },
                                        }}
                                    >
                                        <a>All {container.title}</a>
                                    </Link>
                                ),
                                icon: <FileOutlined />,
                            },
                            {
                                key: `3-${idx}-2`,
                                label: (
                                    <Link
                                        href={{
                                            pathname: '/admin/contents/create',
                                            query: { container: container.id },
                                        }}
                                    >
                                        <a>Create a {container.title.toLocaleLowerCase()}</a>
                                    </Link>
                                ),
                                icon: <PlusCircleOutlined />,
                            },
                        ],
                    })),
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
                            <a>Create an element</a>
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
                            <a>Create an user</a>
                        </Link>
                    ),
                    icon: <PlusCircleOutlined />,
                },
                {
                    key: '2',
                    label: (
                        <Link href="/admin/users/roles">
                            <a>Roles</a>
                        </Link>
                    ),
                    icon: <IdcardOutlined />,
                },
            ]}
        />
    )

    const FormsMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href="/admin/forms/create">
                            <a>Create an form</a>
                        </Link>
                    ),
                    icon: <PlusCircleOutlined />,
                },
                {
                    type: 'divider',
                },
                {
                    key: '2',
                    label: (
                        <Link href="messages">
                            <a>Messages</a>
                        </Link>
                    ),
                    icon: <MailOutlined />,
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

                    <Dropdown overlay={containersMenu}>
                        <Space>
                            <Link href="/admin/containers">
                                <a>
                                    <Text>
                                        <ContainerOutlined style={{ marginRight: 4 }} />
                                        Containers
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

                    <Dropdown overlay={FormsMenu}>
                        <Space>
                            <Link href="/admin/forms">
                                <a>
                                    <Text>
                                        <FormOutlined style={{ marginRight: 4 }} />
                                        Forms
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
