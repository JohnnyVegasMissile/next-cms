'use client'

import { Button, Typography, Popconfirm, Space, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, CaretRightOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Form } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AdminTable from '~/components/AdminTable'
import { getForms } from '~/network/forms'

const { Text } = Typography

dayjs.extend(relativeTime)

type DataType = Form & {
    _count: {
        fields: number
    }
}

const columns: ColumnsType<DataType> = [
    {
        sorter: true,
        title: 'Name',
        key: 'name',
        render: (role: DataType) => role.name,
    },
    {
        sorter: true,
        title: 'Nb of fields',
        key: 'nbFields',
        render: (role: DataType) => role._count.fields,
    },
    {
        sorter: true,
        title: 'Messages sent',
        key: 'nbMessages',
        render: (form: DataType) => (
            <Space size="middle">
                <Text>0</Text>
                <Link href={`/admin/messages?formId=${form.id}`} prefetch={false}>
                    <Button size="small" type="link">
                        See all
                        <CaretRightOutlined />
                    </Button>
                </Link>
            </Space>
        ),
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (role: DataType) => dayjs(role.updatedAt).fromNow(),
    },
    {
        width: 1,
        key: 'action',
        render: (role: DataType) => (
            <Space>
                {false ? (
                    <Button type="primary" icon={<EditOutlined />} size="small" disabled={true}>
                        Edit
                    </Button>
                ) : (
                    <Link href={`/admin/forms/${role.id}`} prefetch={false}>
                        <Tooltip title="Edit">
                            <Button type="primary" icon={<EditOutlined />} size="small">
                                Edit
                            </Button>
                        </Tooltip>
                    </Link>
                )}

                <Popconfirm
                    placement="left"
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    // onConfirm={(e) => e?.stopPropagation()}
                    // onCancel={(e) => e?.stopPropagation()}
                    okText="Delete"
                    cancelText="Cancel"
                    disabled={false}
                >
                    <Tooltip title="Delete">
                        <Button disabled={false} type="primary" danger icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Tooltip>
                </Popconfirm>
            </Space>
        ),
    },
]

const Forms = () => {
    return <AdminTable name="roles" columns={columns} request={getForms} />
}

export const dynamic = 'force-dynamic'

export default Forms
