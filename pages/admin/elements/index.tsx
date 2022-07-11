import type { Element } from '@prisma/client'
import { Space, Button, Table, Popconfirm, Input, Select } from 'antd'
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

const { Option } = Select

const AdminElements = () => {
    const [q, setQ] = useState<string | undefined>()
    const [type, setType] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const elements: UseQueryResult<Element[], Error> = useQuery<Element[], Error>(
        ['elements', { q: trim(debouncedQ)?.toLocaleLowerCase() || undefined, type }],
        () => getElements(type, trim(debouncedQ)?.toLocaleLowerCase()),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <>
            <Head>
                <title>Admin - Elements</title>
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
                            placeholder="Search"
                            style={{ width: 180 }}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <Select
                            allowClear
                            value={type}
                            onChange={setType}
                            placeholder="Block"
                            style={{ width: 180 }}
                        >
                            {Object.keys(Blocks).map((key) => (
                                <Option key={key} value={key}>
                                    {get(Blocks, `${key}.name`, '')}
                                </Option>
                            ))}
                        </Select>
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
                    bordered={false}
                    loading={elements.isLoading}
                    dataSource={get(elements, 'data', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 300px)' }}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(elements, 'data', []).length,
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
    { title: 'Block', dataIndex: 'type' },
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
                    <Link href={`/admin/elements/${e.id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>

                <Popconfirm
                    placement="topRight"
                    title={'Are you sur to delete this page?'}
                    onConfirm={() => deleteElement(e.id)}
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
