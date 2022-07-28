import type { Container, Element } from '@prisma/client'
import { Space, Button, Table, Popconfirm, Input, Select, Breadcrumb } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import moment from 'moment'
import { useQuery, UseQueryResult } from 'react-query'
import { getElements, deleteElement } from '../../../network/elements'
import get from 'lodash.get'
import trim from 'lodash.trim'
import useDebounce from '../../../hooks/useDebounce'
import { useState } from 'react'
import Blocks from '../../../blocks'
import Head from 'next/head'
import { deleteContainer, getContainers } from '../../../network/containers'

const { Option } = Select

const AdminElements = () => {
    const [q, setQ] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const containers: UseQueryResult<Container[], Error> = useQuery<Container[], Error>(
        ['containers', { q: trim(debouncedQ)?.toLocaleLowerCase() || undefined }],
        () => getContainers(trim(debouncedQ)?.toLocaleLowerCase())
    )

    return (
        <>
            <Head>
                <title>Admin - Elements</title>
            </Head>

            <Space
                direction="vertical"
                size="middle"
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
                            placeholder="Search by title"
                            style={{ width: 180 }}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </Space>
                    <Link href="/admin/elements/create">
                        <a>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Create
                            </Button>
                        </a>
                    </Link>
                </div>
                <Table
                    rowKey={(record) => record.id}
                    bordered={false}
                    loading={containers.isLoading}
                    dataSource={get(containers, 'data', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 155px)' }}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(containers, 'data', []).length,
                    }}
                />
            </Space>
        </>
    )
}

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
    },
    {
        title: 'URL',
        render: (e: Container) => {
            return (
                <Link href={`/${e.slug}`}>
                    <a>
                        <Breadcrumb>
                            <Breadcrumb.Item>&#8203;</Breadcrumb.Item>
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
        title: 'Last updated',
        dataIndex: 'updatedAt',
        render: (e: Date) => moment(e).fromNow(),
    },
    {
        width: 155,
        render: (e: Element) => (
            <Space>
                <Button type="primary">
                    <Link href={`/admin/containers/${e.id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>

                <Popconfirm
                    placement="topRight"
                    title={'Are you sur to delete this container?'}
                    onConfirm={() => deleteContainer(e.id)}
                    okText="Delete"
                    cancelText="Cancel"
                >
                    <Button danger>Delete</Button>
                </Popconfirm>
            </Space>
        ),
    },
]

AdminElements.requireAuth = true

export default AdminElements
