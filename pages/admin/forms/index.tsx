import { useState } from 'react'
import { Space, Button, Table, Popconfirm, Input } from 'antd'
import Link from 'next/link'
import moment from 'moment'
import get from 'lodash.get'
import trim from 'lodash.trim'
import type { Form, Page } from '@prisma/client'
import { useQuery, UseQueryResult } from 'react-query'
import { PlusOutlined } from '@ant-design/icons'

import useDebounce from '../../../hooks/useDebounce'
import { getForms, deleteForm } from '../../../network/forms'
import Head from 'next/head'

const AdminPages = () => {
    const [q, setQ] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const forms: UseQueryResult<Form[], Error> = useQuery<Form[], Error>(
        ['forms', { q: trim(debouncedQ)?.toLocaleLowerCase() || undefined }],
        () => getForms(trim(debouncedQ)?.toLocaleLowerCase())
    )

    return (
        <>
            <Head>
                <title>Admin - Forms</title>
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
                            id="search"
                            placeholder="Search by title"
                            style={{ width: 180 }}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </Space>
                    <Link href="/admin/forms/create">
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
                    loading={forms.isLoading}
                    dataSource={get(forms, 'data', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 155px)' }}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(forms, 'data', []).length,
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
        title: 'Send Email To',
        dataIndex: 'sendTo',
    },
    {
        title: 'Nb of fields',
        dataIndex: '_count',
        render: (count: any) => get(count, 'fields', 0),
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
                    <Link href={`/admin/forms/${e.id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>

                <Popconfirm
                    placement="topRight"
                    title={'Are you sur to delete this page?'}
                    onConfirm={() => deleteForm(e.id)}
                    okText="Delete"
                    cancelText="Cancel"
                >
                    <Button danger>Delete</Button>
                </Popconfirm>
            </Space>
        ),
    },
]

AdminPages.requireAuth = true

export default AdminPages
