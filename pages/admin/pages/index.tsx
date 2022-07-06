import type { Page } from '@prisma/client'
import {
    Space,
    Button,
    Table,
    Breadcrumb,
    Badge,
    Tag,
    Typography,
    Popconfirm,
    Modal,
} from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import moment from 'moment'
import { useQuery, UseQueryResult } from 'react-query'
import { getPages, deletePage } from '../../../network/pages'
import get from 'lodash.get'

const { confirm } = Modal

const AdminPages = () => {
    const pages: UseQueryResult<Page[], Error> = useQuery<Page[], Error>(
        ['pages'],
        () => getPages(),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Space direction="vertical" size="large" style={{ width: '100%', padding: 15 }}>
            <Link href="/admin/pages/create">
                <a>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Create
                    </Button>
                </a>
            </Link>
            <Table
                bordered={false}
                loading={pages.isLoading}
                dataSource={get(pages, 'data', [])}
                columns={columns}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: get(pages, 'data', []).length,
                }}
            />
        </Space>
    )
}

const showDeleteConfirm = (id: string) => {
    confirm({
        title: 'Are you sure to delete this page?',
        icon: <ExclamationCircleOutlined />,
        content:
            'Deleting an article page will delete the articles associated to it. if you wish to keep them just pass the page to unpublished',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => deletePage(id),
        onCancel() {
            console.log('Cancel')
        },
    })
}

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
    },
    {
        title: 'Type',
        dataIndex: 'type',
        render: (e: 'home' | 'error' | 'page' | 'list') => {
            const types = {
                home: { label: 'Homepage', color: '#108ee9' },
                error: { label: 'Not Found', color: '#f50' },
                page: { label: 'Page', color: '#2db7f5' },
                list: { label: 'List', color: '#87d068' },
            }

            return <Tag color={types[e].color}>{types[e].label}</Tag>
        },
    },
    {
        title: 'URL',
        render: (e: Page) => {
            if (e.type === 'home') {
                return (
                    <Link href="/">
                        <a>
                            <Typography.Text>/</Typography.Text>
                        </a>
                    </Link>
                )
            }

            return (
                <Link href={`/${e.slug}`}>
                    <a>
                        <Breadcrumb>
                            {e.slug!.split('/').map((s: string, idx: number) => (
                                <Breadcrumb.Item key={idx}>{s}</Breadcrumb.Item>
                            ))}
                        </Breadcrumb>
                    </a>
                </Link>
            )
        },
    },
    {
        title: 'Published',
        dataIndex: 'published',
        render: (e: boolean) => {
            return (
                <Badge
                    status={e ? 'success' : 'error'}
                    text={e ? 'Published' : 'Unpublished'}
                />
            )
        },
    },

    {
        title: 'Last updated',
        dataIndex: 'updatedAt',
        render: (e: Date) => moment(e).fromNow(),
    },
    {
        width: 1,
        render: (e: Page) => (
            <Space>
                <Button type="primary">
                    <Link href={`/admin/pages/${e.id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>

                {e.type === 'list' ? (
                    <Button onClick={() => showDeleteConfirm(e.id)} danger>
                        Delete
                    </Button>
                ) : (
                    <Popconfirm
                        placement="topRight"
                        title={'Are you sur to delete this page?'}
                        disabled={e.type === 'error' || e.type === 'home'}
                        onConfirm={() => deletePage(e.id)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button danger disabled={e.type === 'error' || e.type === 'home'}>
                            Delete
                        </Button>
                    </Popconfirm>
                )}
            </Space>
        ),
    },
]

AdminPages.requireAuth = true

export default AdminPages
