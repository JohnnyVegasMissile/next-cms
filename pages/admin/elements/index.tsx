import type { Element } from '@prisma/client'
import { Space, Button, Table, Popconfirm, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import moment from 'moment'
import { useQuery, UseQueryResult } from 'react-query'
import { getElements, deleteElement } from '../../../network/elements'
import get from 'lodash.get'

const AdminElements = () => {
    const elements: UseQueryResult<Element[], Error> = useQuery<Element[], Error>(
        ['elements'],
        () => getElements(),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Space direction="vertical" size="large" style={{ width: '100%', padding: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                    <Input placeholder="Search" />
                    <Input placeholder="Block" />
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
