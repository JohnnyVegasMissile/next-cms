import { useState } from 'react'
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
    Input,
    Select,
} from 'antd'
import Link from 'next/link'
import moment from 'moment'
import get from 'lodash.get'
import trim from 'lodash.trim'
import type { Page } from '@prisma/client'
import { useQuery, UseQueryResult } from 'react-query'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'

import useDebounce from '../../../hooks/useDebounce'
import { getPages, deletePage } from '../../../network/pages'
import { PageTypes } from '../../../types'
import Head from 'next/head'

const { confirm } = Modal
const { Option } = Select

const AdminPages = () => {
    const [q, setQ] = useState<string | undefined>()
    const [type, setType] = useState<PageTypes | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const pages: UseQueryResult<Page[], Error> = useQuery<Page[], Error>(
        ['pages', { q: trim(debouncedQ)?.toLocaleLowerCase() || undefined, type }],
        () => getPages(type, trim(debouncedQ)?.toLocaleLowerCase()),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <>
            <Head>
                <title>Admin - Pages</title>
            </Head>

            <Space
                direction="vertical"
                size="large"
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: '#f0f2f5',
                    minHeight: 'calc(100vh - 29px)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input
                            value={q}
                            allowClear
                            id="search"
                            placeholder="Search"
                            style={{ width: 180 }}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <Select
                            allowClear
                            value={type}
                            id="type"
                            onChange={setType}
                            placeholder="Type"
                            style={{ width: 180 }}
                        >
                            <Option value="page">Page</Option>
                            <Option value="list">List</Option>
                            <Option value="home">Homepage</Option>
                            <Option value="error">Not found</Option>
                        </Select>
                    </Space>
                    <Link href="/admin/pages/create">
                        <a>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Create
                            </Button>
                        </a>
                    </Link>
                </div>
                <Table
                    bordered={false}
                    loading={pages.isLoading}
                    dataSource={get(pages, 'data', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 155px)' }}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(pages, 'data', []).length,
                    }}
                />
            </Space>
        </>
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
        render: (e: 'home' | 'error' | 'signin' | 'page' | 'list') => {
            const types = {
                home: { label: 'Homepage', color: '#108ee9' },
                error: { label: 'Not Found', color: '#f50' },
                page: { label: 'Page', color: '#2db7f5' },
                list: { label: 'List', color: '#87d068' },
                signin: { label: 'Sign In', color: '#1d39c4' },
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
        width: 155,
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
                        disabled={e.type !== 'page' && e.type !== 'list'}
                        onConfirm={() => deletePage(e.id)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button danger disabled={e.type !== 'page' && e.type !== 'list'}>
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
